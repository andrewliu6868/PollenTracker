import React from 'react';
import {Text, View, StyleSheet, Image } from 'react-native';
import ScreenWrap from '../components/ScreenWrap.jsx';
import {Button} from '../components/ScreenWrap.jsx';
import { StatusBar } from 'expo-status-bar';
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';

export default function Entrypage(){
    // Navigates to login and signup

    return (
        <ScreenWrap bg="white">
            <View style={styles.container}>
                <Image style={styles.mainImage} source={require('../assets/welcome.png')}/>
                <View style={{gap: 15}}></View>
                <Text style={styles.title}> AllergyTracker</Text>
                <Text style={styles.caption}> Sign up and breathe easier with personalized allergy tracking at your fingertips </Text>
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
        height: heightP(30),
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
    }
})