import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL, AMBEE_API_KEY } from '@env';  // Import environment variables


// Axios instance for API calls
const api = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,  // Timeout after 10 seconds
});


const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
  }
};

// Function to log in user
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/allergy_tracker/token/', {
      username,
      password,
    });
    return response.data;  // Should contain access and refresh tokens
  } catch (error) {
    console.error('Error logging in:', error.response.data);
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (email, password, password2, username, firstName, lastName) => {
  try {
    const response = await api.post('/allergy_tracker/user/register/', {
      username,
      email,
      password,
      password2,  // Confirm password
      first_name: firstName,
      last_name: lastName,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response.data);
    throw error;
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