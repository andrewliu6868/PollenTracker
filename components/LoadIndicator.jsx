import {  StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import {theme} from '../style/theme.js'

export default function LoadIndicator({size="large", color=theme.colors.primary}){
  return (
    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

const styles = StyleSheet.create({})
