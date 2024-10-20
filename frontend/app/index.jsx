import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { router, useRouter } from 'expo-router';
import ScreenWrap from '../components/ScreenWrap.jsx';
import React, { useEffect } from 'react'

export default function index(){
  const router = useRouter();

  // auto direct to welcome page
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/Entrypage');
    }, 2000); // add a 2-second delay to showcase loading effect
  }, [router]);

  // eventually replace default acitivity indicator with a more aesthetic one
  return (
    <ScreenWrap>
        <View style = {styles.container}>
            <ActivityIndicator size="large" color="#00ff00" />
        </View>
    </ScreenWrap>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
