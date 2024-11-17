import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { SERVER_IP, PROJECT_ID, AMBEE_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual backend URL
const BASE_URL = SERVER_IP; 

// Axios instance for API calls
const api = axios.create({
  baseURL: SERVER_IP,
  timeout: 10000,  // Timeout after 10 seconds
});

// cache the expo push token to avoid losing the value
let cachedExpoPushToken = null;

export const getExpoPushToken = async () => {
  // Return the cached token if it's already set
  if (cachedExpoPushToken) {
    console.log('[DEBUG] Using cached Expo Push Token:', cachedExpoPushToken);
    return cachedExpoPushToken;
  }

  try {
    // Check if the token is stored in AsyncStorage
    const storedToken = await AsyncStorage.getItem('expo_push_token');
    if (storedToken && storedToken.startsWith("ExponentPushToken")) {
      console.log('[DEBUG] Retrieved Expo Push Token from storage:', storedToken);
      cachedExpoPushToken = storedToken;
      return storedToken;
    }

    // If not found, fetch a new token
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID });
    
    if (expoPushToken && expoPushToken.startsWith("ExponentPushToken")) {
      console.log('[DEBUG] Fetched new Expo Push Token:', expoPushToken);
      cachedExpoPushToken = expoPushToken;
      await AsyncStorage.setItem('expo_push_token', expoPushToken);
      return expoPushToken;
    }

    console.error('[ERROR] Failed to get a valid Expo Push Token');
    return null;
  } catch (error) {
    console.error('[ERROR] Error getting Expo Push Token:', error.message);
    return null;
  }
};

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";


export const updateMedication = async (medicationId, updatedMed) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found, please log in again');
  }

  try {
    const expoPushToken = await getExpoPushToken();
    if (!expoPushToken) {
      throw new Error('Failed to get valid Expo Push Token');
    }

    // delete any scheduled notifications
    if (updatedMed.reminder_notification_ids?.length > 0) {
      await cancelNotifications(updatedMed.reminder_notification_ids);
    }
    
    if (updatedMed.refill_notification_id) {
      await cancelNotifications([updatedMed.refill_notification_id]);
    }

    // ensure reminders are valid dates
    const formattedReminderTimes = updatedMed.reminder_times?.map(time => 
      typeof time === 'string' ? new Date(time) : time
    );

    // format the medication objects
    const medicationData = {
      ...updatedMed,
      reminder_times: formattedReminderTimes,
      expo_push_token: expoPushToken
    };

    // put call to update
    const response = await api.put(
      `/allergy_tracker/medications/${medicationId}/`, 
      medicationData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const savedMedication = response.data;

    // reschedule the reminders
    if (formattedReminderTimes?.length > 0) {
      const newNotificationIds = await scheduleReminderNotifications(
        formattedReminderTimes,
        savedMedication,
        updatedMed.start_date,
        updatedMed.end_date
      );
      savedMedication.reminder_notification_ids = newNotificationIds;
    }

    // rescheulde the refill date
    if (updatedMed.refill_reminder && updatedMed.refill_date) {
      const refillNotificationId = await scheduleRefillNotification(
        updatedMed.refill_date,
        savedMedication
      );
      savedMedication.refill_notification_id = refillNotificationId;
    }

    return savedMedication;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};


export const deleteMedication = async (medicationId) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    console.error('No token found, please log in again');
    return false;
  }
  try {
    const medication = await getMedications(medicationId);
    
    if (medication.reminder_notification_ids) {
      await cancelNotifications(medication.reminder_notification_ids);
    }
    if (medication.refill_notification_id) {
      await cancelNotifications([medication.refill_notification_id]);
    }

    const response = await api.delete(`/allergy_tracker/medications/delete/${medicationId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.status === 204;
  } catch (error) {
    console.error("Error deleting medication:", error.response?.data || error.message);
    return false;
  }
};

// function to get medicaiton from user
export const getMedications = async () => {
  const token = await getAuthToken();
  if (!token) {
    console.warn('No token found, redirecting to login');
    // Optionally redirect to login page
    return [];
  }

  try {
    const response = await api.get('/allergy_tracker/medications/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching medications:', error);
    return [];
  }
};

export const postMedication = async (medication) => {
  const jwtToken = await AsyncStorage.getItem('token');
  if (!jwtToken) {
    console.error('No authentication token found');
    return;
  }

  try {
    // retrieve push token first
    const expoPushToken = await getExpoPushToken();
    if (!expoPushToken) {
      throw new Error('Failed to get valid Expo Push Token');
    }

    // attach push token to object
    const medicationWithToken = {
      ...medication,
      expo_push_token: expoPushToken
    };

    const response = await api.post('/allergy_tracker/medications/add/', medicationWithToken, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    const savedMedication = response.data;

      // scheduler reminders
    if (medication.reminder_times?.length > 0) {
      const notificationIds = await scheduleReminderNotifications(
          medication.reminder_times,
          savedMedication,
          medication.start_date,
          medication.end_date
      );

      console.log('[DEBUG] Scheduled Notification IDs:', notificationIds);

        if (notificationIds?.length > 0) {
          savedMedication.reminder_notification_ids = notificationIds;

          // update the medication entry in the backend with the new IDs
          const updateResponse = await api.put(
            `/allergy_tracker/medications/${savedMedication.id}/`,
            { reminder_notification_ids: notificationIds },
            { headers: { Authorization: `Bearer ${jwtToken}` } }
          );
        }
      }

      // schedule refill notification if needed
      if (medication.refill_reminder && medication.refill_date) {
        const refillNotificationId = await scheduleRefillNotification(medication.refill_date, savedMedication);

        if (refillNotificationId) {
          savedMedication.refill_notification_id = refillNotificationId;

          await api.put(
            `/allergy_tracker/medications/${savedMedication.id}/`,
            { refill_notification_id: refillNotificationId },
            { headers: { Authorization: `Bearer ${jwtToken}` } }
          );
        }
      }

      return savedMedication;
  } catch (error) {
    console.error('Error adding medication:', error.message);
    throw error;
  }
};


const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No token found');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};


// Function to log in user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/allergy_tracker/token/`, {
      username,
      password,
    });

    const { access } = response.data;
    if (access) {
      await AsyncStorage.setItem('token', access);
      await registerDeviceToken();
      return response.data;
    } else {
      throw new Error('No access token received');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    Alert.alert('Login Error', 'Please log in again');
    return null;
  }
};


// Function to register a new user
export const registerUser = async (email, password, password2, username, firstName, lastName) => {
  try {
    const response = await api.post('/allergy_tracker/user/register/', {
      username,
      email,
      password,
      password2,
      first_name: firstName,
      last_name: lastName,
    });
    
    // Automatically log in after registration
    const loginResponse = await loginUser(username, password);
    
    return loginResponse;
  } catch (error) {
    console.error('Error registering user:', error.response?.data || error);
    throw error;
  }
};

export const registerDeviceToken = async () => {
  try {
    const jwtToken = await AsyncStorage.getItem('token');
    if (!jwtToken) {
      console.warn('[DEBUG] No authentication token found');
      return;
    }

    // Request notification permissions
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }

    // Get the Expo Push Token
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID });

    if (!expoPushToken || !expoPushToken.startsWith("ExponentPushToken")) {
      console.error('[ERROR] Invalid Expo Push Token:', expoPushToken);
      return;
    }

    console.log('[DEBUG] Successfully retrieved Expo Push Token:', expoPushToken);

    // Store the token in both AsyncStorage and a global variable
    cachedExpoPushToken = expoPushToken;
    await AsyncStorage.setItem('expo_push_token', expoPushToken);

    // Send the Expo Push Token to your backend
    await axios.post(
      `${BASE_URL}/allergy_tracker/register-device-token/`, 
      { expo_push_token: expoPushToken }, 
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );

    console.log('[DEBUG] Expo Push Token registered successfully');
    return expoPushToken;
  } catch (error) {
    console.error('[ERROR] Error registering device token:', error.message);
  }
};


export const scheduleReminderNotifications = async (reminderTimes, medication, startDate, endDate) => {
  const expoPushToken = await getExpoPushToken();
  console.log(`[DEBUG] Scheduling notification with token: ${expoPushToken}`);
  if (!expoPushToken) {
    throw new Error('No valid Expo Push Token provided');
  }

  const notificationIds = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const reminderTime of reminderTimes) {
    const time = new Date(reminderTime);
    if (isNaN(time.getTime())) {
      console.error('[ERROR] Invalid reminder time:', reminderTime);
      continue;
    }

    // Only schedule if the time is in the future and before end date
    if (time >= new Date() && time <= end) {
      try {
        const notificationData = {
          to: expoPushToken,
          title: `Reminder: ${medication.med_name}`,
          body: `It's time to take your medication: ${medication.dosage}`,
          sound: 'default',
          priority: 'high',
          data: { 
            medicationId: medication.id,
            type: 'medication_reminder'
          },
        };

        const response = await axios.post(
          EXPO_PUSH_ENDPOINT, 
          notificationData,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data?.data?.id) {
          notificationIds.push(response.data.data.id);
          console.log(`[DEBUG] Successfully scheduled notification: ${response.data.data.id}`);
        } else {
          console.error('[ERROR] No notification ID received:', response.data);
        }
      } catch (error) {
        console.error('[ERROR] Failed to schedule notification:', error.response?.data || error.message);
      }
    }
  }

  return notificationIds;
};

export const scheduleRefillNotification = async (refillDate, medication) => {
  const expoPushToken = await getExpoPushToken();
  const refillTime = new Date(refillDate);

  if (isNaN(refillTime.getTime())) {
    console.error('[ERROR] Invalid refill date:', refillDate);
    return null;
  }

  if (refillTime < new Date()) {
    console.error('[ERROR] Refill date is in the past:', refillDate);
    return null;
  }

  if (!expoPushToken || !expoPushToken.startsWith("ExponentPushToken")) {
    console.error('[ERROR] Invalid Expo Push Token:', expoPushToken);
    return null;
  }

  try {
    console.log('[DEBUG] Scheduling refill notification with token:', expoPushToken);

    const notificationData = {
      to: expoPushToken,
      title: `Refill Reminder: ${medication.med_name}`,
      body: "It's time to refill your medication!",
      sound: 'default',
      priority: 'high',
      data: { 
        medicationId: medication.id,
        type: 'refill_reminder'
      },
      trigger: { date: refillTime }
    };

    const response = await axios.post(
      EXPO_PUSH_ENDPOINT,
      notificationData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data?.data?.id) {
      console.log('[DEBUG] Refill notification scheduled:', response.data.data.id);
      return response.data.data.id;
    } else {
      console.error('[ERROR] Failed to schedule refill notification:', response.data);
      return null;
    }
  } catch (error) {
    console.error('[ERROR] Error scheduling refill notification:', error.response?.data || error.message);
    return null;
  }
};


export const cancelNotifications = async (notificationIds) => {
  for (const id of notificationIds) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
};


export const saveJournalEntry = async (data) => {
  const token = await getAuthToken();
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const response = await api.post('allergy_tracker/journal/create/', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Entry saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving journal entry:', error.response.data);
  }
};

export const getJournalEntries = async () => {
  const token = await getAuthToken();
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const response = await api.get('/allergy_tracker/journal/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting journal entries:', error.response.data);
    throw error;
  }
};

export const getWeeklyJournalEntries = async () => {
  const token = await getAuthToken();
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const response = await api.get('/allergy_tracker/journal/weekly/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting weekly journal entries:', error.response.data);
    throw error;
  }
}


export const getLatestPollenData = async (latitude, longitude) => {

  try {
    const response = await api.get(`https://api.ambeedata.com/latest/pollen/by-lat-lng?lat=${latitude}&lng=${longitude}`, {
      headers: {
        'x-api-key': AMBEE_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error: Unable to fetch pollen data from the location', error);
    throw error;
  }
};