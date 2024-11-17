import { View, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions } from './api.js';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Layout() {

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.warn('Notifications permissions not granted');
      } else {
        console.log('Notification permissions granted');
      }
    } else {
      console.log('Notification permissions already granted');
    }
  };
  
  // notification listeners
  useEffect(() => {
    requestNotificationPermissions();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      Alert.alert(
        notification.request.content.title || 'Notification',
        notification.request.content.body || 'You have a new notification',
        [{ text: 'OK', onPress: () => console.log('Notification received') }]
      );
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response.notification.request.content);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // Render the Stack navigator
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
