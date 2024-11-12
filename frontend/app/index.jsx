import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrap from '../components/ScreenWrap.jsx';
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';

export default function Index() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResourcesAndNavigate = async () => {
      try {
        // Load fonts
        await Font.loadAsync({
          'Cursive': require('../assets/fonts/DancingScript-Regular.ttf'),
        });
        setFontsLoaded(true);

        setTimeout(() => {
          router.push('/Entrypage');
        }, 2000);
      } catch (error) {
        console.error('Error loading resources', error);
      }
    };

    loadResourcesAndNavigate();
  }, [router]);

  // Display loading text or activity indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <ScreenWrap>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </ScreenWrap>
    );
  }

  return (
    <ScreenWrap>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    </ScreenWrap>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
