import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import AddMedication from './AddMedication.jsx';

export default function Medication() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [meds, setMeds] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const addNewMedication = (med) => {
        // name, descriptions, dosage, frequency, refill
        if (!med.name || !med.description || !med.dosage || !med.frequency || !med.refill ) {
            console.error('Incomplete medication data');
            return;
        }
        const newMed = { id: Date.now(), ...med };
        setMeds([...meds, newMed]);
    };

    const saveMedsToStorage = async (medications) => {
        try {
            await AsyncStorage.setItem('medications', JSON.stringify(medications));
        } catch (error) {
            console.error('Error saving medications', error);
        }
    };

    const loadMedsFromStorage = async () => {
        try {
            const medsString = await AsyncStorage.getItem('medications');
            if (medsString) setMeds(JSON.parse(medsString));
        } catch (error) {
            console.error('Error loading medications', error);
        }
    };

    useEffect(() => {
        loadMedsFromStorage();
    }, []);

    useEffect(() => {
        saveMedsToStorage(meds);
    }, [meds]);

    return (
        <ScreenWrap>
            <View style={styles.container}>
                <TopBar title="Medication" />
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Medication</DataTable.Title>
                        <DataTable.Title>Description</DataTable.Title>
                        <DataTable.Title>Reminder Time</DataTable.Title>
                    </DataTable.Header>
                    <FlatList
                        data={meds}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <DataTable.Row>
                                <DataTable.Cell>{item.name}</DataTable.Cell>
                                <DataTable.Cell>{item.description}</DataTable.Cell>
                                <DataTable.Cell>{item.time}</DataTable.Cell>
                            </DataTable.Row>
                        )}
                    />
                </DataTable>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <AddMedication
                    isVisible={isAddModalVisible}
                    onClose={() => setIsAddModalVisible(false)}
                    onAddMedication={addNewMedication}
                />
            </View>
        </ScreenWrap>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#6200ee',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
    },
});
