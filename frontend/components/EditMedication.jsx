import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, Switch, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateMedication, deleteMedication } from '../app/api.js';

export default function EditMedication({ isVisible, onClose, medication, onSaveEdit }) {
  const [medName, setMedName] = useState('');
  const [medDesc, setMedDesc] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [reminderTimes, setReminderTimes] = useState([]);
  const [repeatCount, setRepeatCount] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [refillDate, setRefillDate] = useState(new Date());
  const [refillReminder, setRefillReminder] = useState(false);
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(null);

  const insets = useSafeAreaInsets();

  // fetch the existing medication from the backend
  useEffect(() => {
    if (medication) {
      setMedName(medication.name || '');
      setMedDesc(medication.description || '');
      setDosage(medication.dosage || '');
      setFrequency(medication.frequency || 1);
      setReminderTimes(medication.reminderTimes || []);
      setRepeatCount(medication.repeatCount || 1);
      setStartDate(medication.startDate ? new Date(medication.startDate) : new Date());
      setEndDate(medication.endDate ? new Date(medication.endDate) : new Date());
      setRefillDate(medication.refillDate ? new Date(medication.refillDate) : new Date());
      setRefillReminder(!!medication.refillReminder);
    }
  }, [medication]);

  // update the medication for the backend
  const handleSave = async () => {
    if (!medName || !medDesc || dosage === '') {
      Alert.alert('Error', 'Please enter all medication details!');
      return;
    }

    const updatedMedication = {
      id: medication.id,
      name: medName,
      description: medDesc,
      dosage,
      frequency,
      reminderTimes,
      repeatCount,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      refillDate: refillReminder ? refillDate.toISOString().split('T')[0] : null,
      refillReminder,
    };

    // update the backend
    const success = await updateMedication(medication.id, updatedMedication);
    if (success) {
      onSaveEdit(updatedMedication);
      onClose();
    } else {
      Alert.alert('Error', 'Failed to update medication');
    }
  };

  // event handler for frequency changes
  const handleFreqChange = (freq) => {
    setFrequency(freq);
    if (reminderTimes.length < freq) {
      setReminderTimes((prevTimes) => [
        ...prevTimes,
        ...new Array(freq - prevTimes.length).fill(new Date()),
      ]);
    } else {
      setReminderTimes(reminderTimes.slice(0, freq));
    }
    if (selectedPickerIndex >= freq) {
      setSelectedPickerIndex(null);
    }
  };

  // event handler for reminder times changes
  const handleReminderTimeChange = (index, event, selectedTime) => {
    if (selectedTime) {
      setReminderTimes((prevTimes) => {
        const updatedTimes = [...prevTimes];
        updatedTimes[index] = selectedTime;
        return updatedTimes;
      });
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ paddingTop: insets.top, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Edit Medication</Text>
          <TextInput
            style={styles.input}
            placeholder="Medication Name"
            value={medName}
            onChangeText={setMedName}
          />
          <TextInput
            style={styles.input}
            placeholder="Medication Description"
            value={medDesc}
            onChangeText={setMedDesc}
          />
          <Text style={styles.headerText}>Dosage</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dosage"
            value={dosage}
            onChangeText={setDosage}
          />

          <Text style={styles.headerText}>Frequency per Day</Text>
          <Picker selectedValue={frequency} onValueChange={handleFreqChange} style={styles.picker}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <Picker.Item key={value} label={`${value} times per day`} value={value} />
            ))}
          </Picker>

          {reminderTimes.map((time, index) => (
            <View key={index}>
              <Button title={`Pick Time ${index + 1}`} onPress={() => setSelectedPickerIndex(index)} />
              {selectedPickerIndex === index && (
                <DateTimePicker
                  value={time instanceof Date ? time : new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => handleReminderTimeChange(index, event, selectedTime)}
                />
              )}
            </View>
          ))}

          <Button title="Save Changes" onPress={handleSave} />
          <Button title="Close" onPress={onClose} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
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
});
