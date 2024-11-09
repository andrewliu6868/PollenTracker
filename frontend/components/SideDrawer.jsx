import { View, Text, Alert, Modal, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useRouter} from 'expo-router';
import { Drawer } from 'react-native-paper';

export default function SideDrawer({visible, onClose}){
    const router = useRouter();
    const [active, setActive] = useState('');

    const handleNav = (route, item) => {
        if (route){
            setActive(item);
            router.push(route);
            onClose();
        }else{
            alert('Page not ready');
        }
    };
    return (
        <Modal       
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} onPress={onClose}/>
            <View style={styles.drawer}>
                <Drawer.Section title = "Navigation">
                    <Drawer.Item label="Home" active={active == 'first'} onPress={() => handleNav('/home', 'first')}/>
                    <Drawer.Item label="Medications" active={active == 'second'} onPress={() => handleNav( '/medication','second')}/>
                    <Drawer.Item label="Symptom Tracking" active={active == 'third'} onPress={() =>handleNav( null, 'third')}/>
                </Drawer.Section>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
      width: '75%',
      height: '100%',
      backgroundColor: '#fff',
      padding: 20,
      position: 'absolute',
      right: 0,
    },
  });