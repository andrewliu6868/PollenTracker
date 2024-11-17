import { View, ScrollView, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <BackButton router={router} />
            <Text style={styles.titleText}>
              Welcome to{'\n'} PollenPulse!
            </Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput 
              icon={<Email strokeWidth={0.75} iconColor={theme.colors.gray} />} 
              placeholder="Enter your email"
              onChangeText={(text) => { emailRef.current = text }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <CustomInput 
              icon={<UserIcon strokeWidth={0.75} iconColor={theme.colors.gray} />} 
              placeholder="Enter your first name"
              onChangeText={(text) => { fnRef.current = text }}
              autoCapitalize="words"
            />
            <CustomInput 
              icon={<UserIcon strokeWidth={0.75} iconColor={theme.colors.gray} />} 
              placeholder="Enter your last name"
              onChangeText={(text) => { lnRef.current = text }}
              autoCapitalize="words"
            />
            <CustomInput 
              icon={<UserIcon strokeWidth={0.75} iconColor={theme.colors.gray} />} 
              placeholder="Enter your username"
              onChangeText={(text) => { usernameRef.current = text }}
              autoCapitalize="none"
            />
            <CustomInput 
              icon={<Password strokeWidth={0.75} iconColor={theme.colors.gray} />} 
              placeholder="Enter your password"
              secureTextEntry={true}
              onChangeText={(text) => { passRef.current = text }}
              autoCapitalize="none"
            />
            <CustomInput 
              icon={<Password strokeWidth={0.75} iconColor={theme.colors.gray} />} 
              placeholder="Confirm your password"
              secureTextEntry={true}
              onChangeText={(text) => { confirmPassRef.current = text }}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              text="Submit" 
              loading={loading} 
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: widthP(5),
    paddingBottom: heightP(4),
  },
  header: {
    paddingTop: heightP(2),
    marginBottom: heightP(4),
  },
  titleText: {
    fontSize: heightP(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginTop: heightP(2),
    lineHeight: heightP(5),
  },
  formContainer: {
    gap: heightP(2.5),
    marginBottom: heightP(4),
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: heightP(2),
  }
});