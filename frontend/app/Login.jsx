import { View, Text, StyleSheet, StatusBar, Alert} from 'react-native'
import React from 'react'
import { theme } from '../style/theme' 
import ScreenWrap from '../components/ScreenWrap'
import HomeIcon from '../assets/icons/HomeIcon'
import BackButton from '../components/BackButton'
import Email from '../assets/icons/Email'
import Password from '../assets/icons/Password'
import { useRouter } from 'expo-router'
import { widthP, heightP } from '../style/deviceSpecs'
import CustomInput from '../components/CustomInput'
import LoadIndicator from '../components/LoadIndicator'
import { useRef, useState } from 'react'
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from './api';  // Import the API service


export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const emailRef = useRef("");
    const passRef = useRef("");

    const onSubmit = async() =>{
        // check if all fields are filled in
        if(!emailRef.current || !passRef.current){
            Alert.alert('Login Error', 'Please fill in all fields!');
            return;
        }
        
        setLoading(true);  // Show loading indicator
        try {
            // Make the API call to login the user
            const data = await loginUser(emailRef.current, passRef.current);
            
            // Save tokens (you can use AsyncStorage to save tokens locally)
            const { access, refresh } = data;
            // Save tokens in AsyncStorage
            await AsyncStorage.setItem('accessToken', access);
            await AsyncStorage.setItem('refreshToken', refresh);
            console.log('Access Token:', access);
            console.log('Refresh Token:', refresh);
    
            // Direct to home page on successful login
            setLoading(false);
            router.push('/Home');
        } catch (error) {
            setLoading(false);
            console.error('Error logging in:', error);
            Alert.alert('Login Error', 'Invalid email or password');
        }
    }
  return (
    <ScreenWrap>
        <StatusBar style="dark"/>
        <View style={styles.container}>
            <BackButton router = {router}/>
            <View>
                <Text style={styles.titleText}>Welcome Back!</Text>
            </View>
            <View style={styles.spacing}>
                <CustomInput icon = {<Email strokeWidth = {0.75} iconColor={theme.colors.gray} />} placeholder = "Enter your email" onChangeText={(text)=>{emailRef.current = text}}/>
                <CustomInput icon = {<Password strokeWidth = {0.75} iconColor={theme.colors.gray}/>} placeholder = "Enter your password" onChangeText={(text)=> {passRef.current = text}}/>
                <Text style={styles.noPassword}> Can't remember your password?</Text>
                <Button text="Submit" loading={loading} onPress={onSubmit}/>
            </View>
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
    titleText:{
        fontSize: heightP(3.5),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    },
    spacing: {
        gap: 25,
    },
    noPassword: {
        flexDirection: 'row',
        fontSize: heightP(1.5),
        color: theme.colors.text,
        justifyContent: 'flex-end'
    }

})