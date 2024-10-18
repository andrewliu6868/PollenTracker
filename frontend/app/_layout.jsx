import {View,Text} from 'react-native';
import React from 'react';
import {Stack} from 'expo-router';

export default function _layout(){
    // use Stack navigation, screens are stacked on top of each other like cards.
    return (
        <Stack
            screenOptions={{headerShown:false}} // remove the header 
        />
    );
}