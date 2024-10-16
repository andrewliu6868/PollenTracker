import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Backarrow from '../assets/icons/Backarrow'
import { theme } from '../style/theme'

export default function BackButton({router}) {
    // pass in a router as a prop
    return (
        <Pressable onPress = {() => router.back()} style={styles.buttonStyle}>
            <Backarrow strokeWidth = {1.0} iconColor="black"/>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonStyle:{
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm
    }
})
