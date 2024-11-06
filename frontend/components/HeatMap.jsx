import axios from 'axios';
import { AMBEE_API_KEY } from '@env';
import React, {useEffect, useState} from 'react';
import MapView, {Heatmap} from 'react-native-maps';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Geocoder from 'react-native-geocoding';

export default function HeatMap(){
    // fetch async data from api
    const fetchData = async(lat, long) => {
        try{
            const res = await axios.get('https://api.ambeedata.com/latest/pollen/by-lat-lng', {params: {lat: lat, lng: long}, headers: {'x-api-key': AMBEE_API_KEY}});
            return res.data;
        } catch (err){
            console.error('Error: Unable to fetch pollen data from the location', err);
            throw err
        }
    }

    // states to set up map
    const [pollenData, setPollenData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const overlay = async () => {
            try{
                const data = fetchData(40, -75); // sample data, adjust later
                const pollenPoints = data.data.map((point) => ({
                    latitude: point.lat,
                    longitude: point.lng,
                    weight: point.pollen_level,
                }));
                setPollenData(pollenPoints);
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

    return (<MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.73061,
          longitude: -73.935242,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Heatmap
          points={pollenData}
          opacity={0.6}
          radius={20}
          maxIntensity={100}
          gradient={{
            colors: ['#00ff00', '#ffff00', '#ff0000'],
            startPoints: [0.1, 0.5, 1],
            colorMapSize: 256,
          }}
        />
      </MapView>);

};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

