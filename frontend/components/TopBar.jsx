import { View, Text, Pressable, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import Menu from '../assets/icons/Menu'
import SideDrawer from './SideDrawer'
import * as Font from 'expo-font'
import { theme } from '../style/theme'

export default function TopBar({title}){
  const [drawerVis, setDrawerVis] = useState(false);
  const toggleDrawer = () => setDrawerVis(!drawerVis);
  return (
    <View style={styles.container}>
      <Text style = {styles.container}>{title}</Text>
      <Pressable style={styles.menuButton} onPress={toggleDrawer}>
        <Menu strokeWidth={0.75} iconColor='#333'/>
      </Pressable>

      {drawerVis && <SideDrawer visible={drawerVis} onClose={toggleDrawer}/>}
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
        fontFamily: 'Cursive',
        fontSize: 24,
        fontWeight: 'bold',
    },
    menuButton: {
        padding: 8,
    },
});