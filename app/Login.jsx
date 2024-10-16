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

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const emailRef = useRef("");
    const passRef = useRef("");

    const onSubmit = async() =>{
        // check if all fields are filled in
        if(!emailRef.current || !passRef.current){
            Alert.alert('Login', 'Please fill in all fields!');
            return;
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
                <CustomInput icon = {<Email strokeWidth = {0.75} iconColor={theme.colors.gray} />} placeholder = "Enter your email" onChangeText={()=>emailRef.current}/>
                <CustomInput icon = {<Password strokeWidth = {0.75} iconColor={theme.colors.gray}/>} placeholder = "Enter your password" onChangeText={()=> passRef.current}/>
                <Text style={styles.noPassword}> Can't remember your password?</Text>
                <Button titleText="Submit" loading={loading} onPress={onSubmit}/>
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
    },
    noPassword: {
        flexDirection: 'row',
        fontSize: heightP(1.5),
        color: theme.colors.text,
        justifyContent: 'flex-end'
    }

})