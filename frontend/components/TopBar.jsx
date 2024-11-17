import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import Menu from '../assets/icons/Menu'
import SideDrawer from './SideDrawer'
import * as Notifications from 'expo-notifications';

// ensure the hanlder will make notifications show up while the app runs
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});



export default function TopBar({title}){
  const [drawerVis, setDrawerVis] = useState(false);
  const toggleDrawer = () => setDrawerVis(!drawerVis);
  const [notiReceived, setNotiReceived] = useState(false);

  // listen for notifications
    useEffect(() => {
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        Alert.alert(
          notification.request.content.title || 'Notification',
          notification.request.content.body || 'You have received a new notification',
          [{
            text: 'OK',
            onPress: () => {
              console.log('Notification alert dismissed');
              setNotiReceived(false);
            },
          }]
        );
      });
  
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification clicked:', response.notification.request.content);
      });
  
      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    }, []);

  return (
    <View style={styles.container}>
      <Text style = {styles.logoText}>{title}</Text>
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
        paddingBottom: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    logoText:{
        fontFamily: 'DancingScript',
        fontSize: 25,
    },
    menuButton: {
        padding: 8,
    },
});