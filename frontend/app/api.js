import axios from 'axios';
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual backend URL
const BASE_URL = SERVER_IP;  // Use your computer's IP address

// Axios instance for API calls
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,  // Timeout after 10 seconds
});

// function to get medicaiton from user
export const getMedications = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    console.error('No token found, please log in again.');
    return [];
  }
  try {
    const response = await api.get('/medications/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching medications:', error.response?.data || error);
    throw error;
  }
};

// function to add new medication to user
export const postMedication = async (medication) => {
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await api.post('/medications/add/', medication, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    return null;
  }
};



// Function to log in user
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/allergy_tracker/token/', {
      username,
      password,
    });
    const { access } = response.data;
    
    // Store the access token in AsyncStorage
    await AsyncStorage.setItem('token', access);
    
    return response.data; // Return both access and refresh tokens if needed
  } catch (error) {
    console.error('Error logging in:', error.response?.data || error);
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
