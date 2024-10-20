import { View, Text, StyleSheet} from 'react-native'
import React from 'react'
import {useRef, useState} from 'react'
import {useRouter} from 'expo-router'
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

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef("");
  const passRef = useRef("");
  // create refs for first name and last name
  const fnRef = useRef("");
  const lnRef = useRef("");

  const onSubmit = async() =>{
    // check if all fields are filled in
    if(!emailRef.current || !passRef.current || !fnRef.current || !lnRef.current){
        Alert.alert('Sign Up Error!', 'Please fill in all fields!');
        return;
        // add posting to API endpoints once setup
    }else{
      // for now just direct to home page without authentication
      router.push('/Home')
      return;
    }
  }
  return (
    <ScreenWrap>
      <StatusBar style="dark"/>
      <View style={styles.container}>
        <BackButton router={router}/>

        <Text style = {styles.titleText}>
          Welcome to AllergyTracker!
        </Text>

        <View style = {styles.spacing}>
            <CustomInput icon = {<Email strokeWidth = {0.75} iconColor={theme.colors.gray} />} placeholder = "Enter your email" onChangeText={(text)=>{emailRef.current = text}}/>
            <CustomInput icon = {<Password strokeWidth = {0.75} iconColor={theme.colors.gray}/>} placeholder = "Enter your password" onChangeText={(text)=> {passRef.current = text}}/>
            <CustomInput icon = {<UserIcon strokeWidth = {0.75} iconColor={theme.colors.gray}/>} placeholder = "Enter your first name" onChangeText={(text)=> {fnRef.current = text}}/>
            <CustomInput icon = {<UserIcon strokeWidth = {0.75} iconColor={theme.colors.gray}/>} placeholder = "Enter your last name" onChangeText={(text)=> {lnRef.current = text}}/>
        </View>

        <Button text="Submit" loading={loading} onSubmit = {onSubmit}/>
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
      color: theme.colors.text,
  },
  spacing: {
      gap: 25,
  }

})