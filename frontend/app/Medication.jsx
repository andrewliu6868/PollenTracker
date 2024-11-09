import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import {useRouter} from 'expo-router';
import Button from '../components/Button';
import React, {useState} from 'react';
import {DataTable} from 'react-native-paper'
import { heightP, widthP } from '../style/deviceSpecs';
import {AddMedication} from './AddMedication.jsx'

export default function Medication(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [meds, setMeds] = useState([]);
    const [isAddModalVisible, setIsAddModalVisibile] = useState(false);

    const addNewMedication = (med) => {
        setMeds([...meds, {id:meds.length + 1, ...med}]);
    }

    return (
        <ScreenWrap>
            <View style={styles.container}>
                <TopBar title = "Medication"></TopBar>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>ID</DataTable.Title>
                        <DataTable.Title>Medication</DataTable.Title>
                        <DataTable.Title>Description</DataTable.Title>
                        <DataTable.Title>Reminder Time</DataTable.Title>
                    </DataTable.Header>
                    <FlatList
                        data={meds} 
                        keyExtractor={(item) => item.id.toString()}
                        renderItem ={({item}) => (
                            <DataTable.Row>
                                <DataTable.Cell>{item.id}</DataTable.Cell>
                                <DataTable.Cell>{item.name}</DataTable.Cell>
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
                    onClose={() => setIsAddModalVisibile(false)}
                    onAddMedication ={addNewMedication}
                />

            </View>

        </ScreenWrap>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
