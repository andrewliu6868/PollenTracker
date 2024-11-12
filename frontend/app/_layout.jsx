import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {

  // Render the Stack navigator once fonts are loaded
  return (
    <Stack
      screenOptions={{ headerShown: false }} // Remove the header
    />
  );
}
