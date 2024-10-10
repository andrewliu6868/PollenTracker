import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theme } from '../style/theme';

export default function Button({
    buttonStyle, 
    textStyle, 
    text, 
    onPress = () => {}, 
    loading = false,
    hasShadow = true
 }){
    const styleShadow = {

    }
    return (
        <Pressable onPress={onPress} style = {[styles.general, buttonStyle, (hasShadow && styleShadow ) ]}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    general: {
        backgroundColor: theme.colors.primary,
        height: hp(6.5),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl

    },
    text: {
        fontSize: hp(3),
        color: 'white',
        fontWeight: theme.fonts.bold
    }
});