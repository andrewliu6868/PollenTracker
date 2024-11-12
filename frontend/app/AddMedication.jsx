import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { heightP,widthP } from '../style/deviceSpecs';
import axios from 'axios';
import { theme } from '../style/theme';


export default function AddMedication({isVisible, onClose, onAddMed}){
    const [medName, setMedName] = useState('');
    const [remTime, setRemTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [search, setSearch] = useState([]);
    const [drop, setDrop] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);

    // fetch med details from FDA database
    const fetchMedications = async(query) =>{
        if(query.length > 2) {
            try{
                const response = await axios.get('`https://api.fda.gov/drug/label.json?search=${query}&limit=10`');
                setSearch(response.data.results);
                setDrop(true);
            } catch(err){
                console.error('Error fetching medication data: ', err);
                setSearch([]);
            }
        } else {
            setSearch([])
            setDrop(false);
        }
    }

    const selectMedication = (med) => {
        setMedName(medication.openfda.brand_name ? medication.openfda.brand_name[0] : '');
        setSelectedMedication(med);
        setDrop(false);
    }

    const onSubmit = () => {
        // error checking
        if(!medName){
            alert("Error: Please enter all medication details!");
            return;
        }
        // pass medication details to parent
        onAddMed({
            name: medName,
            description: selectedMedication ? selectedMedication.description[0] : '',
            time: remTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        })

        // reset fields and close the modal
        setMedName('');
        setSelectedMedication(null);
        setRemTime(new Date());
        onClose();


    }
    return (
        <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Add Medication</Text>
                    <TextInput style = {styles.input} placeHolder="Medication Name" value={medName} onChangeText={() => {setMedName()}}></TextInput>
                    {drop && (<FlatList
                        data = {search}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress = {() => selectMedication({item})}>
                                <View style={styles.dropdownItem}>
                                    <Text>{item.openfda.brand_name ? item.openfda.brand_name[0] : ''}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        style = {styles.dropdown}
                    />) }

                    {selectedMedication && (<View style = {styles.descriptionBox}>
                        <Text>Description:</Text>
                        <Text>{selectedMedication.description ? selectedMedication.description[0]: 'No description found'}</Text>
                    </View>)}

                    <Button title="Pick Reminder Time" onPress={() => setShowPicker(true)}/>
                    {showPicker && (
                        <DateTimePicker value={remTime} mode="time" display="default" onChange={(event,selectedTime) => {
                            setShowPicker(false);
                            if(selectedTime){
                                setRemTime(selectedTime);
                            }
                        }}/>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button title="Save" onPress={onSubmit}/>
                        <Button title="Close" onPress={onClose}/>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },  
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    dropdown:{
        maxHeight: 150,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    descriptionBox: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})