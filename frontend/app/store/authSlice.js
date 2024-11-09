// app/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setUser, setToken, logout, setError } = authSlice.actions;
export default authSlice.reducer;

// Async actions
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post('/api/login/', credentials);
    const { token, user } = response.data;

    await SecureStore.setItemAsync('jwtToken', token);

    dispatch(setUser(user));
    dispatch(setToken(token));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  await SecureStore.deleteItemAsync('jwtToken');
  dispatch(logout());
};
