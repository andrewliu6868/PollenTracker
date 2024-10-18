import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import ScreenWrap from '../components/ScreenWrap.jsx';
import {StatusBar} from 'expo-status-bar';
import { widthP,heightP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';

export default function Homepage(){
    return (
        <ScreenWrap>
            <Text style={styles.title}> Home</Text>
            <StatusBar style ="dark"/>
            <View style = {styles.container}>

            </View>
            <View style={{gap: 20}}>

            </View>
        </ScreenWrap> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'grey',
        paddingHorizontal: widthP(8),
    },
    title: {
        color: theme.colors.text,
        fontSize: heightP(8),
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold
    }
});