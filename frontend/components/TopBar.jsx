import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import Menu from '../assets/icons/Menu'
import SideDrawer from './SideDrawer'
import * as Notifications from 'expo-notifications';


export default function TopBar({title}){
  const [drawerVis, setDrawerVis] = useState(false);
  const toggleDrawer = () => setDrawerVis(!drawerVis);
  const [notiReceived, setNotiReceived] = useState(false);

  // listen for notifications
    useEffect(() => {
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        if (!notiReceived){
          setNotiReceived(true);
          Alert.alert(
            notification.request.content.title,
            notification.request.content.body,
            [{ text: 'OK', onPress: () => {
              console.log('Notification received'); 
              setNotiReceived(false);
            }}]
          );
        }
      });
  
      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification clicked:', response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }, [notiReceived]);

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