import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import ScreenWrap from '../components/ScreenWrap'
import { StatusBar } from 'expo-status-bar';
import Menu from '../assets/icons/Menu'
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';
import React from 'react'
import TopBar from '../components/TopBar.jsx';
import HeatMap from '../components/HeatMap.jsx';

export default function Home() {
  return (
    <ScreenWrap>
        <View style={styles.container}>
            <TopBar/>
        </View>
        <ScrollView style={styles.body}>
            <HeatMap lat={40} long={75}/>
        </ScrollView>

    </ScreenWrap>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },

    top:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginHorizontal: widthP(5)
    },

    appName:{
        color: theme.colors.text,
        fontSize: heightP(3.5),
        fontWeight: theme.fonts.bold
    },

    body:{
        alignItems: 'center'
    }
})