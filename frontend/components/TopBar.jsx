import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React from 'react'
import Menu from '../assets/icons/Menu'
import { theme } from '../style/theme'

export default function TopBar(){
  return (
    <View style={styles.container}>
      <Text style = {styles.container}>PollenSense</Text>

      <Pressable style={styles.menuButton}>
        <Menu strokeWidth={0.75} iconColor={theme.colors.gray}/>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    logoText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    menuButton: {
        padding: 8,
    },
});