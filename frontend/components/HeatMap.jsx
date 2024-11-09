import axios from 'axios';
import { AMBEE_API_KEY } from '@env';
import React, {useEffect, useState} from 'react';
import MapView, {Heatmap} from 'react-native-maps';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import Geocoder from 'react-native-geocoding';

export default function HeatMap(props){
    // states to set up map
    const [pollenData, setPollenData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [heatmap, setHeatMap] = useState([]);
    // fetch async data from api
    const fetchData = async(lat, long) => {
        try{
            const res = await axios.get('https://api.ambeedata.com/latest/pollen/by-lat-lng?lat=41.3874&lng=2.1686', { headers: {'x-api-key': AMBEE_API_KEY, 'Content-Type': 'application/json'}});
            return res.data;
        } catch (err){
            console.error('Error: Unable to fetch pollen data from the location', err);
            throw err
        }
    }
    useEffect(() => {
        const overlay = async () => {
            try{
                const data = await fetchData(props.lat, props.long); // sample data, adjust later
                if (data && data.data) {
                    const pollenPoints = data.data.map((point) => ({
                        latitude: point.lat,
                        longitude: point.lng,
                        weight: point.pollen_level,
                    }));
                    setPollenData(pollenPoints);
                } else {
                    throw new Error('No data available');
                }
            }catch(err){
                setError(err);
            }finally{
                setLoading(false);
            }
        };

        overlay();
    }, []);

    if (loading) return <ActivityIndicator size="large" color= 'green'/>;
    if (error) return <Text> Error loading data</Text>;

    return (
    
    <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.73061,
          longitude: -73.935242,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
      </MapView>);

};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

