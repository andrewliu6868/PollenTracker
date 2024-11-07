import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, ScrollView, Platform, Dimensions, SafeAreaView, StatusBar, FlatList  } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../style/theme';
import ScreenWrap from '../components/ScreenWrap';
import { saveJournalEntry, getJournalEntries } from './api';
import Icon from 'react-native-vector-icons/Ionicons';

const symptomOptions = [
  { id: 'sneezing', label: 'Sneezing' },
  { id: 'coughing', label: 'Coughing' },
  { id: 'itchyEyes', label: 'Itchy Eyes' },
  { id: 'runnyNose', label: 'Runny Nose' },
  { id: 'headache', label: 'Headache' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'congestion', label: 'Congestion' },
  { id: 'skinRash', label: 'Skin Rash' },
  { id: 'itchyThroat', label: 'Itchy Throat' },
  { id: 'swelling', label: 'Swelling' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'dizziness', label: 'Dizziness' },
];

const screenWidth = Dimensions.get('window').width;
const buttonWidth = (screenWidth - 60) / 3; // Adjust based on padding and spacing

export default function Journal() {
  const [symptoms, setSymptoms] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [previousEntries, setPreviousEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await getJournalEntries();
        setPreviousEntries(entries);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };
    fetchEntries();
  }, []);

  const handleSave = async () => {
    try {
      const data = {
        symptoms,
        severity,
        notes,
      };
      const newEntry = await saveJournalEntry(data);

      setPreviousEntries([newEntry, ...previousEntries]);

      setSymptoms([]);
      setSeverity(5);
      setNotes('');
      Alert.alert('Success', 'Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  const toggleSymptom = (symptomId) => {
    if (symptoms.includes(symptomId)) {
      setSymptoms(symptoms.filter(id => id !== symptomId));
    } else {
      setSymptoms([...symptoms, symptomId]);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity <= 3) return theme.colors.severityLow;
    if (severity <= 6) return theme.colors.severityHigh;
    return theme.colors.severityMedium;
  };

  const getSeverityIcon = (severity) => {
    if (severity <= 3) return 'happy-outline';
    if (severity <= 6) return 'sad-outline';
    return 'warning-outline';
  };

  const renderEntryCard = ({ item }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>{item.date_created}</Text>
        <Icon name={getSeverityIcon(item.severity)} size={30} color={getSeverityColor(item.severity)} />
      </View>
      <View style={styles.symptomBubbles}>
        {item.symptoms.map((symptom) => (
          <Text key={symptom} style={styles.symptomBubble}>{symptom}</Text>
        ))}
      </View>
      <Text style={styles.entryNotes}>Notes: {item.notes}</Text>
    </View>
  );


   return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Track Your Symptoms</Text>
          
          {/* Symptom Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Your Symptoms</Text>
            <View style={styles.symptomsGrid}>
              {symptomOptions.map((symptom) => (
                <TouchableOpacity
                  key={symptom.id}
                  style={[
                    styles.symptomButton,
                    symptoms.includes(symptom.id) && styles.symptomButtonSelected,
                  ]}
                  onPress={() => toggleSymptom(symptom.id)}
                >
                  <Text style={[
                    styles.symptomButtonText,
                    symptoms.includes(symptom.id) && styles.symptomButtonTextSelected,
                  ]}>{symptom.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Severity Slider */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Severity</Text>
            <View style={styles.severityContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={severity}
                onValueChange={setSeverity}
                minimumTrackTintColor={getSeverityColor(severity)}
                maximumTrackTintColor={theme.colors.black}
                thumbTintColor={getSeverityColor(severity)}
              />
              <View style={styles.severityLabels}>
                <Text style={styles.severityValue}>{severity}</Text>
                <View style={styles.severityRange}>
                  <Text style={styles.severityLabel}>Mild</Text>
                  <Text style={styles.severityLabel}>Severe</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional observations..."
              placeholderTextColor={theme.colors.lightText}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Symptoms</Text>
          </TouchableOpacity>

          {/* Previous Entries */}
          <FlatList
            data={previousEntries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEntryCard}
            contentContainerStyle={styles.entriesContainer}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    padding: 20,
  },
  content: {
    paddingBottom: 20,  // Prevent overlapping with bottom edge
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  symptomButton: {
    width: buttonWidth - 8,
    height: 50,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  symptomButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  symptomButtonText: {
    fontSize: 14,
    color: theme.colors.black,
    textAlign: 'center',
  },
  symptomButtonTextSelected: {
    color: theme.colors.white,
  },
  severityContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  severityLabels: {
    marginTop: 4,
  },
  severityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  severityRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityLabel: {
    fontSize: 15,
    color: theme.colors.textLight,
  },
  notesInput: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  entriesContainer: {
    paddingTop: 16,
  },
  entryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  symptomBubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  symptomBubble: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 12,
  },
  entryNotes: {
    fontSize: 14,
    color: theme.colors.text,
  },
});