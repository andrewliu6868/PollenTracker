import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, ScrollView, Platform, Dimensions, SafeAreaView, StatusBar, FlatList  } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../style/theme';
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import { saveJournalEntry, getJournalEntries, getLatestPollenData  } from './api';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [topAllergens, setTopAllergens] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await getJournalEntries();
        setPreviousEntries(entries);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };
    const fetchTopAllergens = async () => {
      try {
        // Request permission to access the user's location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required to get allergen data.');
          return null;
        }
    
        // Get the user's current location
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = location.coords;
    
        // Pass the location to the getLatestPollenData function
        // const data = await getLatestPollenData(latitude, longitude);

        const data = {
          "message": "success",
          "lat": 41.3874,
          "lng": 2.1686,
          "data": [
            {
              "timezone": "Europe/Madrid",
              "Species": {
                "Grass": {
                  "Grass / Poaceae": 0
                },
                "Others": 0,
                "Tree": {
                  "Alder": 0,
                  "Birch": 0,
                  "Cypress": 0,
                  "Elm": 0,
                  "Hazel": 0,
                  "Oak": 8,
                  "Pine": 0,
                  "Plane": 0,
                  "Poplar / Cottonwood": 0
                },
                "Weed": {
                  "Chenopod": 5,
                  "Mugwort": 0,
                  "Nettle": 0,
                  "Ragweed": 18
                }
              },
              "Risk": {
                "grass_pollen": "Low",
                "tree_pollen": "Low",
                "weed_pollen": "Moderate"
              },
              "Count": {
                "grass_pollen": 0,
                "tree_pollen": 8,
                "weed_pollen": 25
              },
              "updatedAt": "2024-11-10T21:00:00.000Z"
            }
          ]
        };
        
        
        const filteredAllergens = ExtractTopAllergens(data);

        

        setTopAllergens(filteredAllergens);
        console.log('Top allergens:', topAllergens);

      } catch (error) {
        console.error('Error getting top allergens:', error);
        // Alert.alert('Error', 'Failed to fetch allergen data.');
        throw error;
      }
    };

    const ExtractTopAllergens = (data) => {
      if (!data?.data?.length) {
        console.error('Invalid response data');
        return [];
      }
    
      const speciesData = data.data[0].Species;
      const countData = data.data[0].Count;
    
      const allergensList = [];
    
      if (countData.grass_pollen > 0) {
        Object.entries(speciesData.Grass).forEach(([name, count]) => {
          if(count > 0) allergensList.push({ name, count });
        });
      }
    
      if (countData.tree_pollen > 0) {
        Object.entries(speciesData.Tree).forEach(([name, count]) => {
          if(count > 0) allergensList.push({ name, count });
        });
      }
    
      if (countData.weed_pollen > 0) {
        Object.entries(speciesData.Weed).forEach(([name, count]) => {
          if(count > 0) allergensList.push({ name, count });
        });
      }
    
      if (speciesData.Others) {
        allergensList.push({ name: 'Others', count: speciesData.Others });
      }
    
      allergensList.sort((a, b) => b.count - a.count);
    
      const filteredAllergens = allergensList.slice(0, 5);
    
    
      return filteredAllergens;
    };
    
    fetchEntries();
    fetchTopAllergens();
  }, []);

  

  const handleSave = async () => {
    try {
      const data = {
        symptoms,
        topAllergens,
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
    <ScreenWrap>
      <LinearGradient style={styles.container} colors={theme.colors.gradients.green}>
          <TopBar title="Journal" />
      <ScrollView contentContainerStyle={styles.Journalcontainer}>
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
    </LinearGradient>
  </ScreenWrap>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Journalcontainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
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
    borderWidth: 2,
    borderColor: theme.colors.primaryDark,
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
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primaryDark,
    borderWidth: 2,
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
    backgroundColor: theme.colors.primaryDark,
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