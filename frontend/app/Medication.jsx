import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import React, { useState, useEffect } from 'react';
import AddMedication from './AddMedication.jsx';
import EditMedication from './EditMedication.jsx';
import { getMedications } from './api.js';


export default function Medication() {
    const [meds, setMeds] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currMed, setCurrMed] = useState();

    // load in the medication from the user
    const loadMedsFromBackend = async () => {
        const medsFromBackend = await getMedications();
        if (medsFromBackend && Array.isArray(medsFromBackend)) {
            console.log('Fetched medications:', medsFromBackend); // checking for id
            setMeds(medsFromBackend.map((med) => ({
                id: med.id,  // Ensure `id` is present
                ...med,
              })));
        }
    };

    useEffect(() => {
        loadMedsFromBackend();
    }, []);
      
    // set which medication should be editted
    const editSomeMedication = (med) => {
        if (!med.id) {
          console.error('Medication ID is missing:', med);
        }
        setCurrMed({ id: med.id, ...med });
        setIsEditModalVisible(true);
      };
      

    // update the state of the users medications after an async update is called
    const saveEditedMedication = (updatedMed) => {
        setMeds((prevState) => prevState.map((med) => (med.id === updatedMed.id ? updatedMed : med)));
        setIsEditModalVisible(false);
    };

    // update the state of the users medications after an async delete is called
    const handleDeleteMed = (medId) => {
        const updatedMeds = meds.filter((med) => med.id !== medId);
        setMeds(updatedMeds);
    }
    
    const renderMedicationItem = ({ item }) => (
        <TouchableOpacity onPress={() => editSomeMedication(item)}>
            <View style={styles.row}>
                <Text style={styles.cell}>{item.med_name}</Text>
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
                    keyExtractor={(item, index) => item ? (item.uuid || item.id?.toString() || index.toString()) : index.toString()}
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
                    onDelete={handleDeleteMed}
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
