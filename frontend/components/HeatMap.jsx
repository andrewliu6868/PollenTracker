import axios from 'axios';
import { AMBEE_API_KEY } from '@env';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import Geocoder from 'react-native-geocoding';

export default function HeatMap(props){
    // states to set up map
    const [pollenData, setPollenData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // fetch async data from api
    const fetchData = async(lat, long) => {
        try{
            const res = await axios.get(`https://api.ambeedata.com/latest/pollen/by-lat-lng?lat=${lat}&lng=${long}`, { headers: {'x-api-key': AMBEE_API_KEY, 'Content-Type': 'application/json'}});
            // Ensure the data array exists and is not empty
            if (!res.data.data || res.data.data.length === 0) {
                console.warn('No data available for the given location.');
                return null;
            }

            const data = res.data.data[0];

            const pollenInfo = {
                grassCount: data.Count.grass_pollen,
                treeCount: data.Count.tree_pollen,
                weedCount: data.Count.weed_pollen,
                grassRisk: data.Risk.grass_pollen,
                treeRisk:data.Risk.tree_pollen,
                weedRisk: data.Risk.weed_pollen,
                species: data.Species,
                updatedAt: data.updatedAt,
            }
            return pollenInfo;
        } catch (err){
            console.error('Error: Unable to fetch pollen data from the location', err)
            throw err
        }
    }

    const fetchAreaData = async(place) => {
        try{

        }catch(err){
            console.error('Error: Unable to fetch pollen data from area', err)
            throw err
        }
    }

    useEffect(() => {
        const overlay = async () => {
            try{
                const data = await fetchData(props.lat, props.long); // sample data, adjust later
                setPollenData(data);
            }catch(err){
                setError(err);
            }finally{
                setLoading(false);
            }
        };
        overlay();
    }, [props.lat,props.long]);

    if (loading) return <ActivityIndicator size="large" color= 'green'/>;
    if (error) return <Text> Error loading data</Text>;
    if (!pollenData) return null;

    const getColors = (level) => {
        if (level == 'Low'){
            return 'green'
        }else if (level == 'Moderate'){
            return 'yellow'
        }else if (level == 'High'){
            return 'orange'
        }else{
            return 'red'
        }
    }

    const getAverage = (pData) => {
        const levelToNum={'Low': 1, 'Moderate': 2, 'High': 3, 'Very High': 4}
        const numToLevel={ 1 : 'Low', 2 : 'Moderate', 3 : 'High', 4 : 'Very High'}
        // error handling
        if (!pData.treeRisk || !pData.weedRisk || !pData.grassRisk) return 'Low';
        let avg = (levelToNum[pData.treeRisk] + levelToNum[pData.weedRisk] + levelToNum[pData.grassRisk]) / 3;
        return numToLevel[Math.round(avg)]
    }
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                latitude: props.lat,
                longitude: props.long,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
                }}
            >
                <Marker
                coordinate={{ latitude: props.lat, longitude: props.long }}
                pinColor={
                    getColors(getAverage(pollenData))
                }
                title="Pollen Level"
                description={`Grass: ${pollenData.grassCount}, Tree: ${pollenData.treeCount}, Weed: ${pollenData.weedCount}`}
                />
            </MapView>
            <View style={styles.info}>
                <Text>Grass Pollen: {pollenData.grassCount} ({pollenData.grassRisk})</Text>
                <Text>Tree Pollen: {pollenData.treeCount} ({pollenData.treeRisk})</Text>
                <Text>Weed Pollen: {pollenData.weedCount} ({pollenData.weedRisk})</Text>
                <Text>Last Updated: {new Date(pollenData.updatedAt).toLocaleString()}</Text>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    info: {
        padding: 10,
        backgroundColor:'#fff',
    },
});

