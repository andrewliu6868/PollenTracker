import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, TouchableOpacity, Switch, Platform, KeyboardAvoidingView } from 'react-native';
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
        if (Platform.OS === 'android') {
          setShowAndroidTimePicker(true);
          setSelectedPickerIndex(index);
        } else {
          setSelectedPickerIndex(index);
        }
      };

      const handleTimeChange = (event, selectedTime, index) => {
        if (Platform.OS === 'android') {
          setShowAndroidTimePicker(false);
        }
        
        if (selectedTime) {
          handleReminderTimeChange(index, event, selectedTime);
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
    <Modal visible={isVisible} transparent={false} animationType="slide" onRequestClose={onClose}>
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Medication</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medication Details</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Search in OpenFDA</Text>
                <Switch
                  value={useSearch}
                  onValueChange={(value) => setUseSearch(value)}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={useSearch ? '#2196F3' : '#f4f3f4'}
                  ios_backgroundColor="#767577"
                />
              </View>

              {useSearch ? (
                <TextInput
                  style={styles.input}
                  placeholder="Search Medication"
                  onChangeText={(query) => fetchMedications(query)}
                  placeholderTextColor="#666"
                />
              ) : (
                <>
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
                </>
              )}
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

            {Platform.OS === 'android' && showAndroidTimePicker && (
                <DateTimePicker
                value={reminderTimes[selectedPickerIndex] || new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedTime) => 
                    handleTimeChange(event, selectedTime, selectedPickerIndex)
                }/>
            )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <View style={styles.datePickerContainer}>
                {renderDatePicker(startDate, handleDateChange, 'start')}
                {renderDatePicker(endDate, handleDateChange, 'end')}
              </View>

              {/* Android Date Picker Modal */}
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

            <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
              <Text style={styles.saveButtonText}>Save Medication</Text>
            </TouchableOpacity>
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
    overflow: 'hidden', // This ensures the picker stays within bounds
  },
  pickerContainer: {
    backgroundColor: '#f8f8f8',
    ...Platform.select({
      ios: {
        // iOS specific picker container styling
        paddingVertical: 8,
      },
      android: {
        // Android specific picker container styling
        paddingHorizontal: 16,
      },
    }),
  },
  picker: {
    ...Platform.select({
      ios: {
        height: 160, // Fixed height for iOS
      },
      android: {
        height: 48, // Fixed height for Android
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
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 32,
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
      fontSize: 18,
      fontWeight: '600',
    },
  });