import { View, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Layout() {
  // notification listeners
  useEffect(() => {
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
