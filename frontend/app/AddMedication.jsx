import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { heightP, widthP } from '../style/deviceSpecs';
import axios from 'axios';
import { theme } from '../style/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddMedication({ isVisible, onClose, onAddMed }) {
  const [medName, setMedName] = useState('');
  const [medDesc, setMedDesc] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFreq] = useState('daily');
  const [refillDate, setRefill] = useState(new Date());
  const [useSearch, setUseSearch] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState([]);
  const [drop, setDrop] = useState(false);

  const insets = useSafeAreaInsets();

  // Fetch medication data from the FDA database
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

  const selectMedication = (med) => {
    const name = med.openfda.brand_name ? med.openfda.brand_name[0] : '';
    const desc = med.description ? med.description[0] : 'No description available';
    setMedName(name);
    setMedDesc(desc);
    setSelectedMedication(med);
    setDrop(false);
  };

  const onSubmit = () => {
    if (!medName || (!medDesc && useSearch)) {
      alert('Error: Please enter all medication details!');
      return;
    }
    onAddMed({
      name: medName,
      description: medDesc,
      dosage,
      frequency,
      duration,
      refillDate: refillDate.toDateString(),
    });

    // Reset fields
    setMedName('');
    setMedDesc('');
    setSelectedMedication(null);
    setFrequency('daily');
    setRefill(new Date());
    setUseSearch(true);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
        <View style={styles.modalOverlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Add Medication</Text>

            {/* Toggle between search and manual entry */}
            <View style={styles.switchContainer}>
              <Text>Search in OpenFDA database</Text>
              <Switch value={useSearch} onValueChange={(value) => setUseSearch(value)} />
              <Text>Manual Entry</Text>
            </View>

            {useSearch ? (
              <>
                <Text style={styles.headerText}>Search Medication</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Medication Name"
                  onChangeText={fetchMedications}
                />
                {drop && (
                  <FlatList
                    data={search}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => selectMedication(item)}>
                        <View style={styles.dropdownItem}>
                          <Text>{item.openfda.brand_name ? item.openfda.brand_name[0] : ''}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    style={styles.dropdown}
                  />
                )}
                {selectedMedication && (
                  <View style={styles.descriptionBox}>
                    <Text>Description:</Text>
                    <Text>{medDesc}</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text style={styles.headerText}>Medication Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter medication name"
                  value={medName}
                  onChangeText={setMedName}
                />
                <Text style={styles.headerText}>Description and Instructions</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter medication details"
                  value={medDesc}
                  onChangeText={setMedDesc}
                />
              </>
            )}

            <Text style={styles.headerText}>Dosage</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter dosage (e.g., 2 pills)"
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={styles.headerText}>Frequency</Text>
            <Picker selectedValue={frequency} onValueChange={setFreq} style={styles.picker}>
              <Picker.Item label="Once a day" value="daily" />
              <Picker.Item label="Twice a day" value="twice-daily" />
              <Picker.Item label="Every 6 hours" value="6-hours" />
              <Picker.Item label="Every 8 hours" value="8-hours" />
              <Picker.Item label="Every 12 hours" value="12-hours" />
            </Picker>

            <Button title="Pick Reminder Date" onPress={() => setShowPicker(true)} />
            {showPicker && (
              <DateTimePicker
                value={refillDate}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate){
                    setRefill(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={onSubmit} />
              <Button title="Close" onPress={onClose} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  descriptionBox: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
