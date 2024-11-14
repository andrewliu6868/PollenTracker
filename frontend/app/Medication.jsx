import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import React, { useState, useEffect } from 'react';
import AddMedication from './AddMedication.jsx';

export default function Medication() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [meds, setMeds] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const addNewMedication = (med) => {
        if (!med.name || !med.description || !med.dosage || !med.frequency || !med.refillDate) {
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

    const renderMedicationItem = ({ item }) => (
        <View style={styles.medicationRow}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.description}</Text>
            <Text style={styles.cell}>{item.dosage}</Text>
            <Text style={styles.cell}>{item.frequency}</Text>
            <Text style={styles.cell}>{item.refillDate}</Text>
        </View>
    );

    return (
        <ScreenWrap>
            <View style={styles.container}>
                <TopBar title="Medication" />
                <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>Medication</Text>
                    <Text style={styles.headerCell}>Description</Text>
                    <Text style={styles.headerCell}>Dosage</Text>
                    <Text style={styles.headerCell}>Frequency</Text>
                    <Text style={styles.headerCell}>Refill Date</Text>
                </View>
                <FlatList
                    data={meds}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMedicationItem}
                    contentContainerStyle={styles.listContainer}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <AddMedication
                    isVisible={isAddModalVisible}
                    onClose={() => setIsAddModalVisible(false)}
                    onAddMed={addNewMedication}
                />
            </View>
        </ScreenWrap>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginBottom: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContainer: {
        flexGrow: 1,
    },
    medicationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
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
