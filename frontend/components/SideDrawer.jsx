import { View, Text, Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Drawer } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SideDrawer({ visible, onClose }) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [active, setActive] = useState('');

    const handleNav = (route, item) => {
        if (route) {
            setActive(item);
            router.push(route);
            onClose();
        } else {
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
            <TouchableOpacity style={styles.overlay} onPress={onClose} />

            <SafeAreaView style={[styles.drawer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <Drawer.Section style={styles.titleText} title="Menu">
                    <Drawer.Item 
                        style = {styles.itemText}
                        label="Home" 
                        active={active === 'first'} 
                        onPress={() => handleNav('/Home', 'first')} 
                    />
                    <Drawer.Item 
                        style = {styles.itemText}
                        label="Medications" 
                        active={active === 'second'} 
                        onPress={() => handleNav('/Medication', 'second')} 
                    />
                    <Drawer.Item 
                        style = {styles.itemText}
                        label="Symptom Tracking" 
                        active={active === 'third'} 
                        onPress={() => handleNav('/Journal', 'third')} 
                    />
                    <Drawer.Item 
                        style = {styles.itemText}
                        label="Insights" 
                        active={active === 'third'} 
                        onPress={() => handleNav('/Insights', 'fourth')} 
                    />
                </Drawer.Section>
            </SafeAreaView>
        </Modal>
    );
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        position: 'absolute',
        right: 0,
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5, // For Android shadow
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemText: {
        fontSize: 18,
    },
});
