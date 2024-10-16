import React from 'react';
import {Text, View, StyleSheet, Image, Pressable } from 'react-native';
import {useRouter} from 'expo-router';
import ScreenWrap from '../components/ScreenWrap.jsx';
import Button from '../components/Button.jsx';
import { StatusBar } from 'expo-status-bar';
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';

export default function Entrypage(){
    // Navigates to login and signup
    const router = useRouter();
    return (
        <ScreenWrap bg="white">
            <StatusBar style ="dark"/>
            <View style={styles.container}>
                <Image style={styles.mainImage} source={require('../assets/welcome.png')}/>
                <View style={{gap: 15}}>
                    <Text style={styles.title}> AllergyTracker</Text>
                    <Text style={styles.caption}> Sign up and breathe easier with personalized allergy tracking at your fingertips </Text>
                </View>

                <View style={styles.bStyle}>
                    <Button text = "Sign Up" buttonStyle = {{marginHorizontal:widthP(2)}} onPress={() => router.push('/Login')}/>
                    <View style={[styles.smallText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                        <Pressable onPress = {() => router.push('/SignUp')}>
                            <Text>If you already have an account, login here!</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrap>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        marginHorizontal: widthP(2)
    },

    mainImage: {
        height: heightP(25),
        width: widthP(80),
        alignSelf: 'center',
    },

    title: {
        color: theme.colors.text,
        fontSize: heightP(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold
    },
    caption: {
        color: theme.colors.text,
        fontSize: heightP(1.5),
        textAlign: 'center',
        paddingHorizontal: widthP(10)
    },
    bStyle: {
        gap: 35,
        width: widthP(70)
    },
    smallText:{
        textAlign: 'center',
        fontSize: heightP(0.5),
        flexDirection: 'row'
    }
})