import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { SERVER_IP } from '@env';
import { PROJECT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual backend URL
const BASE_URL = SERVER_IP; 

// Axios instance for API calls
const api = axios.create({
  baseURL: SERVER_IP,
  timeout: 10000,  // Timeout after 10 seconds
});

export const updateMedication = async (medicationId, updatedMed) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    console.error('No token found, please log in again');
    return null;
  }

  try {
    // Ensure reminder times are in the correct format before updating
    const formattedReminderTimes = updatedMed.reminder_times?.map((time) => 
      typeof time === 'string' ? new Date(time) : time
    );

    // Cancel existing notifications if they exist
    if (updatedMed.reminder_notification_ids && updatedMed.reminder_notification_ids.length > 0) {
      await cancelNotifications(updatedMed.reminder_notification_ids);
    }
    if (updatedMed.refill_notification_id) {
      await cancelNotifications([updatedMed.refill_notification_id]);
    }

    // Prepare the updated medication object
    const medicationData = {
      ...updatedMed,
      reminder_times: formattedReminderTimes,
    };

    // Update medication on the backend
    const response = await api.put(`/allergy_tracker/medications/${medicationId}/`, medicationData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const savedMedication = response.data;

    // Reschedule notifications if needed
    if (formattedReminderTimes?.length > 0) {
      const newReminderNotificationIds = await scheduleReminderNotifications(
        formattedReminderTimes,
        savedMedication,
        updatedMed.start_date,
        updatedMed.end_date,
        token
      );
      savedMedication.reminder_notification_ids = newReminderNotificationIds;
    }

    if (updatedMed.refill_reminder && updatedMed.refill_date) {
      const newRefillNotificationId = await scheduleRefillNotification(
        updatedMed.refill_date,
        savedMedication,
        token
      );
      savedMedication.refill_notification_id = newRefillNotificationId;
    }

    return savedMedication;
  } catch (error) {
    console.error('Error updating medication:', error.response?.data || error.message);
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
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    console.log('Sending medication data:', medication);
    const response = await api.post('/allergy_tracker/medications/add/', medication, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const savedMedication = response.data;
    console.log('Medication saved:', savedMedication);
    return savedMedication;
  } catch (error) {
    if (error.response) {
      console.error('Error adding medication:', error.response.data);
    } else {
      console.error('Network or other error:', error.message);
    }
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
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }

    const expoPushToken = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;
    console.log('Expo Push Token:', expoPushToken);

    await axios.post(`${BASE_URL}/allergy_tracker/register-device-token/`, { token: expoPushToken }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Error registering device token:', error);
    Alert.alert('Notification Error', 'Failed to register device for notifications');
  }
};



// function to request notification permissions from user
const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.warn('Notifications permissions not granted');
    }
  }
};

export const scheduleReminderNotifications = async (reminderTimes, medication, startDate, endDate) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found');
    return [];
  }

  const notificationIds = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const reminderTime of reminderTimes) {
    const time = new Date(reminderTime);

    if (isNaN(time.getTime())) {
      console.error('Invalid reminder time:', reminderTime);
      continue;
    }

    if (time >= new Date() && time <= end) {
      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `Reminder: ${medication.med_name}`,
            body: `Take your medication: ${medication.dosage}`,
            sound: 'default',
          },
          trigger: { date: time },
        });

        notificationIds.push(notificationId);
      } catch (error) {
        console.error('Error scheduling reminder notification:', error);
      }
    }
  }

  try {
    await axios.post(
      `${BASE_URL}/allergy_tracker/register-device-token/`,
      { notification_ids: notificationIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error('Error updating device token with notification IDs:', error.response?.data || error.message);
  }

  return notificationIds;
};



export const scheduleRefillNotification = async (refillDate, medication, token) => {
  const refillTime = new Date(refillDate);

  if (isNaN(refillTime.getTime())) {
    console.error('Invalid refill date:', refillDate);
    return null;
  }

  if (refillTime < new Date()) {
    console.error('Refill date is in the past:', refillDate);
    return null;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Refill Reminder: ${medication.med_name}`,
        body: "It's time to refill your medication!",
        sound: 'default',
      },
      trigger: { date: refillTime },
    });
    return notificationId;
  } catch (error) {
    console.error('Error scheduling refill notification:', error);
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