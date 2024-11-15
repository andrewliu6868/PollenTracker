import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import React, { useState, useEffect } from 'react';
import AddMedication from './AddMedication.jsx';
import EditMedication from '../components/EditMedication.jsx';
import { getMedications, postMedication, updateMedication, deleteMedication } from './api.js';


export default function Medication() {
    const [meds, setMeds] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currMed, setCurrMed] = useState();

    const editSomeMedication = (med) => {
        setCurrMed({ ...med }); 
        setIsEditModalVisible(true);
    };

    const loadMedsFromBackend = async () => {
        const medsFromBackend = await getMedications();
        if (medsFromBackend && Array.isArray(medsFromBackend)) {
            setMeds(medsFromBackend);
        }
    };


    const saveEditedMedication = async (updatedMed) => {
        const updated = await updateMedication(updatedMed.id, updatedMed);
        if (updated) {
            loadMedsFromBackend();
        }
    };
    
    useEffect(() => {
        loadMedsFromBackend();
    }, []);
      
    const renderMedicationItem = ({ item }) => (
        <TouchableOpacity onPress={() => editSomeMedication(item)}>
            <View style={styles.row}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.description}</Text>
                <Text style={styles.cell}>{item.dosage}</Text>
                <Text style={styles.cell}>{item.frequency} times/day</Text>
                <Text style={styles.cell}>{item.refillDate}</Text>
            </View>
       </TouchableOpacity>
    );

    const renderTableHeader = () => (
        <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Medication</Text>
            <Text style={styles.headerCell}>Description</Text>
            <Text style={styles.headerCell}>Dosage</Text>
            <Text style={styles.headerCell}>Frequency</Text>
            <Text style={styles.headerCell}>Refill Date</Text>
        </View>
    );

    return (
        <ScreenWrap>
            <View style={styles.container}>
                <TopBar title="Medication" />
                <FlatList
                    data={meds}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMedicationItem}
                    ListHeaderComponent={renderTableHeader}
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
                    onClose={() => {
                        setIsAddModalVisible(false);
                        loadMedsFromBackend();
                    }}
                />
                <EditMedication
                    isVisible={isEditModalVisible}
                    onClose={() => setIsEditModalVisible(false)}
                    onSaveEdit={saveEditedMedication}
                    medication={currMed}
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
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        borderBottomWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    headerCell: {
        minWidth: 120,
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
    },
    cell: {
        minWidth: 120,
        padding: 10,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: '#ddd',
    },
    listContainer: {
        flexGrow: 1,
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
