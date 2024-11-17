import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import ScreenWrap from '../components/ScreenWrap';
import { StatusBar } from 'expo-status-bar';
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TopBar from '../components/TopBar.jsx';
import HeatMap from '../components/HeatMap.jsx';
import Forecast from '../components/Forecast.jsx';
import TodaysReminders from '../components/TodaysReminders.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const SearchBar = ({ 
    placeholder, 
    value, 
    onChangeText, 
    onSubmit, 
    loading, 
    error 
  }) => (
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#666"
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={onSubmit}
          disabled={loading}
        >
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
    const [forecastLoc, setForecastLoc] = useState('california');
    const [latitude, setLat] = useState(45);
    const [longitude, setLong] = useState(-72);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [forecastLoading, setForecastLoading] = useState(false);
    const [forecastError, setForecastError] = useState("");

    const [error, setError] = useState("");

    const translateGeocode = async () => {
        if(!location.trim()){
            return;
        }
        setLoading(true);
        setError(null);
        try{
            // confirm location permissions are properly set
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted'){
                setError('Permission to access location was denied');
                setLoading(false);
                return;
            }

            const geocodeResult = await Location.geocodeAsync(location);
            if (geocodeResult.length > 0){
                const {latitude, longitude} = geocodeResult[0];
                setLat(latitude);
                setLong(longitude);
            } else{
                setError('No results found for the entered location');
            }
        }catch(error){
            console.error("Error: Unable to translate location through geocoding", error);
            setError('Failed to fetch coordinates');
        }finally{
            setLoading(false);
        }
    };

    const handleForecastSearch = () => {
        if (!forecastInput.trim()) {
            setForecastError('Please enter a location');
            return;
        }
        setForecastLoading(true);
        setForecastError("");
        
        // delay for api call
        setTimeout(() => {
            setForecastLoc(forecastInput);
            setForecastLoading(false);
        }, 1000);
    };

    const renderComponents = [
        {key: 'today', render: () =>                 
        <View style={styles.componentContainer}>
            <TodaysReminders />
        </View>
        },
        {key: 'forecast', render: () =>                 
        <View style={styles.componentContainer}>
            <Forecast place={forecastLoc} />
            <SearchBar
                placeholder="Search forecast location"
                value={forecastInput}
                onChangeText={setForecastInput}
                onSubmit={handleForecastSearch}
                loading={forecastLoading}
                error={forecastError}
            />
        </View>
        },
        {key: 'heatmap', render: () => <>
                <View style={styles.componentContainer}>
                    <HeatMap lat={latitude} long={longitude} />
                    <SearchBar
                        placeholder="Search map location"
                        value={mapInput}
                        onChangeText={setMapInput}
                        onSubmit={translateGeocode}
                        loading={loading}
                        error={error}
                    />
                </View>
        </>}
    ]

    return (
        <ScreenWrap>
            <LinearGradient colors={[theme.colors.primary, theme.colors.white]} style={styles.container}>
                <TopBar title='PollenSense' />
            
                <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
                <FlatList
                    data={renderComponents}
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
    componentContainer: {
        width: '100%',
        padding: 16,
        marginBottom: 16,
    },
    scrollContentContainer: {
        paddingVertical: 16,
    },
    searchContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        height: 44,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#2E7D32',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
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
  


