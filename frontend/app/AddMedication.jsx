import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { postMedication, scheduleReminderNotifications, scheduleRefillNotification, updateMedication } from './api.js';

export default function AddMedication({ isVisible, onClose }) {
  const [medName, setMedName] = useState('');
  const [medDesc, setMedDesc] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [reminderTimes, setReminderTimes] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [refillDate, setRefillDate] = useState(new Date());
  const [search, setSearch] = useState([])
  const [useSearch, setUseSearch] = useState(true);
  const [refillReminder, setRefillReminder] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(null);
  const [drop, setDrop] = useState(false)

  const insets = useSafeAreaInsets();

  // set frequency state
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

  // set newReminderTimes
  const handleReminderTimeChange = (index, event, selectedTime) => {
    if (selectedTime) {
      setReminderTimes((prevTimes) => {
        const updatedTimes = [...prevTimes];
        updatedTimes[index] = selectedTime;
        return updatedTimes;
      });
    }
  };

  // fetch medication data from the FDA database
  const fetchMedications = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${query}&limit=10`);
        setSearch(response.data.results);
        setDrop(true);
      } catch (err) {
        console.error('Error fetching medication data: ', err);
        setSearch([]);
      }
    } else {
      setSearch([]);
      setDrop(false);
    }
  };

  const onSubmit = async () => {
    if (!medName || !medDesc || dosage === '' || !startDate || !endDate) {
      alert('Error: Please fill in all medication details!');
      return;
    }
  
    if (endDate < startDate) {
      alert('Error: End date cannot be before the start date.');
      return;
    }
  
    // Prepare the medication object
    const newMedication = {
      med_name: medName,
      description: medDesc,
      dosage,
      frequency: parseInt(frequency),
      reminder_times: reminderTimes.map((time) => time.toISOString()),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      refill_reminder: refillReminder,
      refill_date: refillReminder ? refillDate.toISOString().split('T')[0] : null,
      reminder_notification_ids: [],
      refill_notification_id: null,
    };
  
    console.log('Medication payload:', newMedication);
  
    try {
      const addedMedication = await postMedication(newMedication);
  
      let reminderNotificationIds = [];
      let refillNotificationId = null;
  
      if (reminderTimes.length > 0) {
        const reminderDates = reminderTimes.map((time) => new Date(time));
        reminderNotificationIds = await scheduleReminderNotifications(
          reminderDates,
          addedMedication,
          startDate,
          endDate
        );
      }
  
      if (refillReminder && refillDate) {
        refillNotificationId = await scheduleRefillNotification(
          new Date(newMedication.refill_date),
          addedMedication
        );
      }
  
      console.log('Scheduled Reminder IDs:', reminderNotificationIds);
      console.log('Scheduled Refill ID:', refillNotificationId);
  
      const updatedMedication = {
        ...addedMedication,
        reminder_notification_ids: reminderNotificationIds,
        refill_notification_id: refillNotificationId,
      };
  
      await updateMedication(addedMedication.id, updatedMedication);
  
      alert('Medication added and notifications scheduled successfully!');
  
      // reset the form
      setMedName('');
      setMedDesc('');
      setDosage('');
      setFrequency(1);
      setReminderTimes([]);
      setRefillDate(new Date());
      setRefillReminder(false);
      setStartDate(new Date());
      setEndDate(new Date());
      onClose();
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('Failed to add medication');
    }
  };
  

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ paddingTop: insets.top, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Add Medication</Text>
          <Text style={styles.headerText}>Medication Details</Text>

          <View style={styles.switchContainer}>
            <Text>Search in OpenFDA</Text>
            <Switch value={useSearch} onValueChange={(value) => setUseSearch(value)} />
          </View>
          {useSearch ? (
            <TextInput
              style={styles.input}
              placeholder="Search Medication"
              onChangeText={(query) => fetchMedications(query)}
            />
          ) : (
            <>
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
            </>
          )}

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

          <Text style={styles.headerText}>Start Date</Text>
          <DateTimePicker value={startDate} mode="date" onChange={(e, date) => setStartDate(date)} />

          <Text style={styles.headerText}>End Date</Text>
          <DateTimePicker value={endDate} mode="date" onChange={(e, date) => setEndDate(date)} />

          <View style={styles.switchContainer}>
            <Text>Refill Reminder</Text>
            <Switch value={refillReminder} onValueChange={setRefillReminder} />
          </View>
          {refillReminder && (
            <DateTimePicker value={refillDate} mode="date" onChange={(e, date) => setRefillDate(date)} />
          )}

          <Button title="Save Medication" onPress={onSubmit} />
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
  headerText: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
