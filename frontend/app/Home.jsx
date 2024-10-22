import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import ScreenWrap from '../components/ScreenWrap'
import { StatusBar } from 'expo-status-bar';
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';
import React from 'react'

export default function Home() {
  return (
    <ScreenWrap>
        <View style={styles.container}>
            
            <View style={styles.top}>
                <Text style={styles.appName}>PollenSense</Text>
            </View>

            <View style = {styles.heatmap}>

            </View>

        </View>

    </ScreenWrap>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
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

    heatmap:{
        alignItems: 'center'
    }
})