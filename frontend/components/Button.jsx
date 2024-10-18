import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theme } from '../style/theme';
import { heightP } from '../style/deviceSpecs';
import LoadIndicator from './LoadIndicator';

export default function Button({
    buttonStyle, 
    textStyle, 
    text, 
    onPress = () => {}, 
    loading = false,
    hasShadow = true
 }){
    const styleShadow = {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 15},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4 // standard for ios devices
    }
    // activate loading animation after button is clicked
    if (loading){
        return(
            <View style={[styles.general, buttonStyle, {backgroundColor: 'white'}]}>
                <LoadIndicator />
            </View>
        )
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
        height: heightP(6.5),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl

    },
    text: {
        fontSize: heightP(3),
        color: 'white',
        fontWeight: theme.fonts.bold
    }
});