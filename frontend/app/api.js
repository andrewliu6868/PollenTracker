import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual backend URL
const BASE_URL = 'http://10.0.0.200:8000';  // Use your computer's IP address

// Axios instance for API calls
const api = axios.create({
  baseURL: BASE_URL,
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
    const response = await axios.post('allergy_tracker/journal/', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Entry saved:', response.data);
  } catch (error) {
    console.error('Error saving journal entry:', error.response.data);
  }
};