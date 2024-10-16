import { View, Text, StyleSheet, StatusBar} from 'react-native'
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

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const emailRef = useRef("");
    const passRef = useRef("");
  return (
    <ScreenWrap>
        <StatusBar style="dark"/>
        <View style={styles.container}>
            <BackButton router = {router}/>
            <View>
                <Text style={styles.titleText}>Welcome Back!</Text>
            </View>
            <View style={styles.spacing}>
                <CustomInput icon = {<Email strokeWidth = {0.75} iconColor={theme.colors.gray} />} placeholder = "Enter your email" onChangeText={()=>emailRef.current}/>
                <CustomInput icon = {<Password strokeWidth = {0.75} iconColor={theme.colors.gray}/>} placeholder = "Enter your password" onChangeText={()=> passRef.current}/>
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
        fontSize: heightP(5),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    },
    spacing: {
        gap: 25,
    }

})