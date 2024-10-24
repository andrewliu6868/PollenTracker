import axios from 'axios';

// Replace with your actual backend URL
const BASE_URL = 'http://10.0.0.200:8000';  // Use your computer's IP address

// Axios instance for API calls
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,  // Timeout after 10 seconds
});

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
    console.log('here')
    const response = await api.post('/allergy_tracker/user/register/', {
      username,
      email,
      password,
      password2: password,  // Confirm password
      first_name: firstName,
      last_name: lastName,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response.data);
    throw error;
  }
};