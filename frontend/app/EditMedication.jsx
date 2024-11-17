import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert, Switch, Platform, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateMedication, deleteMedication, cancelNotifications } from './api.js';

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

  const [showAndroidTimePicker, setShowAndroidTimePicker] = useState(false);
  const [showAndroidDatePicker, setShowAndroidDatePicker] = useState(false);
  const [currentDatePickerField, setCurrentDatePickerField] = useState(null);


  const insets = useSafeAreaInsets();
  
  // cross-platform rendering
  const showDatePicker = (fieldName) => {
      if (Platform.OS === 'android') {
        setShowAndroidDatePicker(true);
        setCurrentDatePickerField(fieldName);
      }
  };

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
          setShowAndroidDatePicker(false);
        }
    
        if (selectedDate) {
          switch (currentDatePickerField) {
            case 'start':
              setStartDate(selectedDate);
              break;
            case 'end':
              setEndDate(selectedDate);
              break;
            case 'refill':
              setRefillDate(selectedDate);
              break;
          }
        }
      };

      const showTimePicker = (index) => {
        setSelectedPickerIndex(index);
        if (Platform.OS === 'ios') {
          // Directly show the DateTimePicker for iOS
          setShowAndroidTimePicker(true);
        } else {
          setShowAndroidTimePicker(true);
        }
      };
      const renderDatePicker = (value, onChange, label) => {
        if (Platform.OS === 'ios') {
          return (
            <View style={styles.datePickerWrapper}>
              <Text style={styles.dateLabel}>{label}</Text>
              <DateTimePicker
                value={value}
                mode="date"
                onChange={onChange}
                style={styles.iosDatePicker}
              />
            </View>
          );
        }
    
        return (
          <TouchableOpacity
            style={styles.androidDateButton}
            onPress={() => showDatePicker(label.toLowerCase())}
          >
            <Text style={styles.dateLabel}>{label}</Text>
            <Text style={styles.dateButtonText}>
              {value.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        );
      };

  // fetch the existing medication from the backend
  useEffect(() => {
    if (medication) {
      setMedName(medication.med_name || '');
      setMedDesc(medication.description || '');
      setDosage(medication.dosage || '');
      setFrequency(medication.frequency || 1);
  
      const parsedReminderTimes = (medication.reminder_times || []).map(time => 
        typeof time === 'string' ? new Date(time) : time
      );
      setReminderTimes(parsedReminderTimes);
  
      setStartDate(medication.start_date ? new Date(medication.start_date) : new Date());
      setEndDate(medication.end_date ? new Date(medication.end_date) : new Date());
      setRefillDate(medication.refill_date ? new Date(medication.refill_date) : new Date());
      setRefillReminder(!!medication.refill_reminder);
    }
  }, [medication]);
  

  // handle deleting medication entry
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
            // make sure to delete existing notifications
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
      // delete the existing reminders
      if (updatedMedication.reminder_notification_ids) {
        await cancelNotifications(updatedMedication.reminder_notification_ids);
      }
      if (updatedMedication.refill_notification_id) {
        await cancelNotifications([updatedMedication.refill_notification_id]);
      }
      
      // update with new reminders
      const savedMedication = await updateMedication(medication.id, updatedMedication);
  
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
    setShowAndroidTimePicker(false); 
  
    if (Platform.OS === 'ios' && !selectedTime) return; 
  
    if (selectedTime) {
      setReminderTimes((prevTimes) => {
        const updatedTimes = [...prevTimes];
        updatedTimes[index] = selectedTime;
        return updatedTimes;
      });
    }
  };

  return (
    <Modal visible={isVisible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ paddingTop: insets.top, flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.keyboardAvoidingView, { paddingBottom: insets.bottom }]}
      >
      <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Medication</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medication Details</Text>
              <TextInput
                      style={styles.input}
                      placeholder="Medication Name"
                      value={medName}
                      onChangeText={setMedName}
                      placeholderTextColor="#666"
                    />
              <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Medication Description"
                      value={medDesc}
                      onChangeText={setMedDesc}
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={Platform.OS === 'ios' ? null : 3}
                      textAlignVertical="top"
                    />
            </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dosage</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter dosage (e.g., 2 tablets)"
                  value={dosage}
                  onChangeText={setDosage}
                  placeholderTextColor="#666"
                />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reminder Schedule</Text>

              <Text style={styles.inputLabel}>Times per day</Text>
                <View style={styles.pickerWrapper}>
                    <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={frequency}
                        onValueChange={handleFreqChange}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <Picker.Item
                            key={value}
                            label={`${value} ${value === 1 ? 'time' : 'times'} per day`}
                            value={value}
                        />
                        ))}
                    </Picker>
                    </View>
                </View>

                <Text style={[styles.inputLabel, { marginTop: 16 }]}>Reminder Times</Text>
                <View style={styles.timePickersContainer}>
                    {reminderTimes.map((time, index) => (
                        <TouchableOpacity
                        key={index}
                        style={styles.timePickerButton}
                        onPress={() => showTimePicker(index)}
                        >
                        <Text style={styles.timePickerButtonText}>
                            {time instanceof Date
                            ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : `Set Time ${index + 1}`}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                {Platform.OS === 'ios' && selectedPickerIndex !== null && (
                    <DateTimePicker
                        value={reminderTimes[selectedPickerIndex] || new Date()}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        onChange={(event, selectedTime) =>
                        handleReminderTimeChange(selectedPickerIndex, event, selectedTime)
                        }
                    />
                    )}

                {Platform.OS === 'android' && showAndroidTimePicker && (
                    <DateTimePicker
                        value={reminderTimes[selectedPickerIndex] || new Date()}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedTime) =>
                        handleReminderTimeChange(selectedPickerIndex, event, selectedTime)
                        }
                    />
                    )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <View style={styles.datePickerContainer}>
                {renderDatePicker(startDate, handleDateChange, 'start')}
                {renderDatePicker(endDate, handleDateChange, 'end')}
              </View>

              {Platform.OS === 'android' && showAndroidDatePicker && (
                <DateTimePicker
                  value={
                    currentDatePickerField === 'start' 
                      ? startDate 
                      : currentDatePickerField === 'end'
                      ? endDate
                      : refillDate
                  }
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Refill Reminder</Text>
                <Switch
                  value={refillReminder}
                  onValueChange={setRefillReminder}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={refillReminder ? '#2196F3' : '#f4f3f4'}
                  ios_backgroundColor="#767577"
                />
              </View>
              {refillReminder && renderDatePicker(refillDate, handleDateChange, 'refill')}
            </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Medication</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Delete Medication</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
      </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f8f8',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
  },
  picker: {
    height: 48,
  },
  timePickersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePickerButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  timePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  datePickerWrapper: {
    flex: 1,
  },
  iosDatePicker: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  androidDateButton: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },

pickerWrapper: {
  backgroundColor: '#f8f8f8',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  overflow: 'hidden', 
},
pickerContainer: {
  backgroundColor: '#f8f8f8',
  ...Platform.select({
    ios: {
      paddingVertical: 8,
    },
    android: {
      paddingHorizontal: 16,
    },
  }),
},
picker: {
  ...Platform.select({
    ios: {
      height: 160, 
    },
    android: {
      height: 48, 
    },
  }),
},
  pickerItem: {
      fontSize: 16,
      color: '#333',
  },
  inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#666',
      marginBottom: 8,
  },
  timePickersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
  },
  timePickerButton: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: '#f8f8f8',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
  },
  timePickerButtonText: {
      fontSize: 16,
      color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 14, // Reduced padding
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12, // Reduced margin
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 14, // Reduced padding
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20, // Reduced margin
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16, // Slightly smaller font
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16, // Slightly smaller font
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12, // Use gap for spacing between buttons
  }
});