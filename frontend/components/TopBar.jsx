import { View, Text, Pressable, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import Menu from '../assets/icons/Menu'
import SideDrawer from './SideDrawer'
import { theme } from '../style/theme'

export default function TopBar(props){
  const [drawerVis, setDrawerVis] = useState(false);
  const toggleDrawer = () => setDrawerVis(!drawerVis);
  return (
    <View style={styles.container}>
      <Text style = {styles.container}>{props.title}</Text>
      <Pressable style={styles.menuButton} onPress={() => {toggleDrawer}}>
        <Menu strokeWidth={0.75} iconColor={theme.colors.gray}/>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    menuButton: {
        padding: 8,
    },
});