import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import TopBar from '../components/TopBar'
import ScreenWrap from '../components/ScreenWrap'
import CustomInput from '../components/CustomInput'

export default function UserProfile (){
    const [loading, setLoading] = useState(false);

    const emailRef = useRef("");
    const usernameRef = useRef("");
    const fnRef = useRef("");
    const lnRef = useRef("");
    const city = useRef("");
    const location = useRef("")

    const onSubmit = async () => {

    }
    
  return (
        <ScreenWrap>
            <View style={styles.container}>
                <TopBar title="User Profile Info"/>

                


            </View>
        </ScreenWrap>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    spacing:{
        gap: 25,
    },
});
