import { View, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function Layout() {
  // notification listeners
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      Alert.alert(
        notification.request.content.title,
        notification.request.content.body,
        [{ text: 'OK', onPress: () => console.log('Notification received') }]
      );
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Render the Stack navigator
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
