import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert } from 'react-native';
import { Slider } from '@react-native-community/slider';
import { theme } from '../style/theme';
import ScreenWrap from '../components/ScreenWrap';
import { saveJournalEntry } from './api';

export default function Journal() {
  const [symptoms, setSymptoms] = useState({
    sneezing: false,
    coughing: false,
    itchyEyes: false,
    runnyNose: false,
  });
  const [severity, setSeverity] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    try {
      const data = {
        symptoms,
        severity,
        notes,
      };
      await saveJournalEntry(data);
      Alert.alert('Success', 'Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  const handleSymptomChange = (symptom) => {
    setSymptoms((prevSymptoms) => ({
      ...prevSymptoms,
      [symptom]: !prevSymptoms[symptom],
    }));
  };

  return (
    <ScreenWrap>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Track Your Symptoms</Text>
        
        <Text style={styles.label}>Symptoms:</Text>
        {Object.keys(symptoms).map((symptom) => (
          <View key={symptom} style={styles.checkboxContainer}>
            <Text>{symptom}</Text>
            <CheckBox
              value={symptoms[symptom]}
              onValueChange={() => handleSymptomChange(symptom)}
            />
          </View>
        ))}

        <Text style={styles.label}>Overall Severity:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={severity}
          onValueChange={setSeverity}
        />
        <Text>Severity: {severity}</Text>

        <Text style={styles.label}>Additional Notes:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />

        <Button title="Save" onPress={handleSave} />
      </ScrollView>
    </ScreenWrap>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  textInput: {
    borderColor: theme.colors.text,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});