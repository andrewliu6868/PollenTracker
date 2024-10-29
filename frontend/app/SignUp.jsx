import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import CustomInput from '../components/CustomInput'
import ScreenWrap from '../components/ScreenWrap'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import LoadIndicator from '../components/LoadIndicator'
import Email from '../assets/icons/Email'
import Password from '../assets/icons/Password'
import UserIcon from '../assets/icons/UserIcon'
import { theme } from '../style/theme'
import Button from '../components/Button'
import { widthP, heightP } from '../style/deviceSpecs'
import { registerUser } from './api'

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef("");
  const passRef = useRef("");
  const confirmPassRef = useRef("");
  const usernameRef = useRef("");
  const fnRef = useRef("");
  const lnRef = useRef("");

  const onSubmit = async () => {
    if (!emailRef.current || !passRef.current || !confirmPassRef.current || !usernameRef.current || !fnRef.current || !lnRef.current) {
      Alert.alert('Sign Up Error!', 'Please fill in all fields!');
      return;
    }

    if (passRef.current !== confirmPassRef.current) {
      Alert.alert('Sign Up Error!', 'Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      await registerUser(emailRef.current, passRef.current, confirmPassRef.current, usernameRef.current, fnRef.current, lnRef.current);
      setLoading(false);
      Alert.alert('Success', 'Registration successful!');
      router.push('/Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Sign Up Error', 'Could not register. Please try again.');
    }
  }

  return (
    <ScreenWrap>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        <Text style={styles.titleText}>
          Welcome to AllergyTracker!
        </Text>

        <View style={styles.spacing}>
          <CustomInput icon={<Email strokeWidth={0.75} iconColor={theme.colors.gray} />} placeholder="Enter your email" onChangeText={(text) => { emailRef.current = text }} />
          <CustomInput icon={<UserIcon strokeWidth={0.75} iconColor={theme.colors.gray} />} placeholder="Enter your first name" onChangeText={(text) => { fnRef.current = text }} />
          <CustomInput icon={<UserIcon strokeWidth={0.75} iconColor={theme.colors.gray} />} placeholder="Enter your last name" onChangeText={(text) => { lnRef.current = text }} />
          <CustomInput icon={<UserIcon strokeWidth={0.75} iconColor={theme.colors.gray} />} placeholder="Enter your username" onChangeText={(text) => { usernameRef.current = text }} />
          <CustomInput icon={<Password strokeWidth={0.75} iconColor={theme.colors.gray} />} placeholder="Enter your password" secureTextEntry={true} onChangeText={(text) => { passRef.current = text }} />
          <CustomInput icon={<Password strokeWidth={0.75} iconColor={theme.colors.gray} />} placeholder="Confirm your password" secureTextEntry={true} onChangeText={(text) => { confirmPassRef.current = text }} />
          </View>

        <Button text="Submit" loading={loading} onPress={onSubmit} />
      </View>
    </ScreenWrap>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingHorizontal: widthP(3)
  },
  titleText: {
    fontSize: heightP(5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  spacing: {
    gap: 20,
  }
})