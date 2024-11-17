import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import ScreenWrap from '../components/ScreenWrap';
import { theme } from '../style/theme.js';
import React, { useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import HeatMap from '../components/HeatMap.jsx';
import Forecast from '../components/Forecast.jsx';
import TodaysReminders from '../components/TodaysReminders.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const SearchBar = ({ placeholder, value, onChangeText, onSubmit, loading, error }) => (
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit} // Trigger search when the "enter" key is pressed
          returnKeyType="search"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
  
  
export default function Home() {
  const [mapInput, setMapInput] = useState('');
  const [forecastInput, setForecastInput] = useState('');
  const [location, setLocation] = useState('');
  const [forecastLoc, setForecastLoc] = useState('California');
  const [latitude, setLat] = useState(45);
  const [longitude, setLong] = useState(-72);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState('');
  const [error, setError] = useState('');

  const translateGeocode = async () => {
    if (!mapInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }
  
      console.log("Geocoding input:", mapInput); // Use mapInput here
      const geocodeResult = await Location.geocodeAsync(mapInput);
      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];
        setLat(latitude);
        setLong(longitude);
        console.log("Coordinates found:", latitude, longitude);
      } else {
        setError('No results found for the entered location');
      }
    } catch (error) {
      console.error('Error during geocoding', error);
      setError('Failed to fetch coordinates');
    } finally {
      setLoading(false);
    }
  };
  

  const handleForecastSearch = () => {
    if (!forecastInput.trim()) {
      setForecastError('Please enter a location');
      return;
    }
    setForecastLoading(true);
    setForecastError('');
    setTimeout(() => {
      setForecastLoc(forecastInput);
      setForecastLoading(false);
    }, 1000);
  };

  return (
    <ScreenWrap>
      <LinearGradient colors={[theme.colors.primary, theme.colors.white]} style={styles.container}>
        <TopBar title='PollenPulse' />
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
          <FlatList
            data={[
              {
                key: 'today',
                render: () => (
                  <View style={styles.section}>
                    <TodaysReminders />
                  </View>
                ),
              },
              {
                key: 'forecast',
                render: () => (
                  <View style={styles.section}>
                    <SearchBar
                      placeholder="Search forecast location"
                      value={forecastInput}
                      onChangeText={setForecastInput}
                      onSubmit={handleForecastSearch}
                      loading={forecastLoading}
                      error={forecastError}
                    />
                    <Forecast place={forecastLoc} />
                  </View>
                ),
              },
              {
                key: 'heatmap',
                render: () => (
                  <View style={styles.section}>
                    <SearchBar
                    placeholder="Search map location"
                    value={mapInput}
                    onChangeText={setMapInput}
                    onSubmit={translateGeocode} 
                    loading={loading}
                    error={error}
                    />
                    <HeatMap lat={latitude} long={longitude} />
                  </View>
                ),
              },
            ]}
            renderItem={({ item }) => item.render()}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.scrollContentContainer}
          />
        </SafeAreaView>
      </LinearGradient>
    </ScreenWrap>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContentContainer: {
    paddingBottom: 32,
    paddingTop: 32,

  },
  searchContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
