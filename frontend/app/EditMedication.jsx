import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, Alert, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateMedication, deleteMedication, cancelNotifications, scheduleReminderNotifications, scheduleRefillNotification } from './api.js';

export default function EditMedication({ isVisible, onClose, medication, onSaveEdit, onDelete }) {
  const [medName, setMedName] = useState('');
  const [medDesc, setMedDesc] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [reminderTimes, setReminderTimes] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [refillDate, setRefillDate] = useState(new Date());
  const [refillReminder, setRefillReminder] = useState(false);
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(null);

  const insets = useSafeAreaInsets();

  // fetch the existing medication from the backend
  useEffect(() => {
    if (medication) {
      setMedName(medication.med_name || '');
      setMedDesc(medication.description || '');
      setDosage(medication.dosage || '');
      setFrequency(medication.frequency || 1);
      setReminderTimes(medication.reminder_times || []);
      setStartDate(medication.start_date ? new Date(medication.start_date) : new Date());
      setEndDate(medication.end_date ? new Date(medication.end_date) : new Date());
      setRefillDate(medication.refill_date ? new Date(medication.refill_date) : new Date());
      setRefillReminder(!!medication.refill_reminder);
    }
  }, [medication]);

  // handle deleting medication
  const handleDelete = async () => {
    if (!medication || !medication.id) {
      console.error('Invalid medication data');
      Alert.alert('Error', 'Invalid medication data');
      return;
    }

    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Cancel all existing notifications before deleting
            if (medication.reminder_notification_ids) {
              await cancelNotifications(medication.reminder_notification_ids);
            }
            if (medication.refill_notification_id) {
              await cancelNotifications([medication.refill_notification_id]);
            }

            const success = await deleteMedication(medication.id);
            if (success) {
              onDelete(medication.id);
              onClose();
            } else {
              Alert.alert('Error', 'Could not delete medication');
            }
          } catch (error) {
            console.error('Error deleting medication:', error);
            Alert.alert('Error', 'Failed to delete medication');
          }
        },
      },
    ]);
  };

  

  const handleSave = async () => {
    if (!medName || !medDesc || dosage === '') {
      Alert.alert('Error', 'Please enter all medication details!');
      return;
    }
  
    if (endDate < startDate) {
      Alert.alert('Error', 'End date cannot be before the start date.');
      return;
    }
  
    const updatedMedication = {
      id: medication.id,
      med_name: medName,
      description: medDesc,
      dosage,
      frequency,
      reminder_times: reminderTimes.map((time) => time.toISOString()),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      refill_reminder: refillReminder,
      refill_date: refillReminder ? refillDate.toISOString().split('T')[0] : null,
      reminder_notification_ids: medication.reminder_notification_ids,
      refill_notification_id: medication.refill_notification_id,
    };
  
    try {
      // Cancel existing notifications
      if (updatedMedication.reminder_notification_ids) {
        await cancelNotifications(updatedMedication.reminder_notification_ids);
      }
      if (updatedMedication.refill_notification_id) {
        await cancelNotifications([updatedMedication.refill_notification_id]);
      }
  
      // Update medication in the backend
      const savedMedication = await updateMedication(medication.id, updatedMedication);
  
      // Schedule new reminder notifications
      if (reminderTimes.length > 0) {
        const newReminderNotificationIds = await scheduleReminderNotifications(
          updatedMedication.reminder_times,
          updatedMedication,
          startDate,
          endDate
        );
        savedMedication.reminder_notification_ids = newReminderNotificationIds;
      }
  
      // Schedule a new refill notification if applicable
      if (refillReminder && refillDate) {
        const newRefillNotificationId = await scheduleRefillNotification(
          updatedMedication.refill_date,
          updatedMedication
        );
        savedMedication.refill_notification_id = newRefillNotificationId;
      }
  
      onSaveEdit(savedMedication);
      onClose();
    } catch (error) {
      console.error('Error updating medication:', error);
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

          <Button title="Save Changes" onPress={handleSave} />
          <Button title="Delete Entry" onPress={handleDelete}/>
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
  redTitle: {
    color: 'red',
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
