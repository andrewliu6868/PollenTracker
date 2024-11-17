import axios from 'axios';
import { AMBEE_API_KEY } from '@env';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, Circle} from 'react-native-maps';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {theme} from '../style/theme';

const RADIUS = 5000;
const GRID_SIZE = 3;
const DEFAULT_REGION = { // default to san fran for now, change later
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
};


export default function HeatMap(props){
    const [pollenData, setPollenData] = useState(null);
    const [peripheralData, setPeripherals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataError, setDataError] = useState(null);
    const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);

    const validateCoordinate = (lat, lng) => {
        return !isNaN(lat) && !isNaN(lng) && 
               lat >= -90 && lat <= 90 && 
               lng >= -180 && lng <= 180;
    };

    useEffect(() => {
        if (validateCoordinate(props.lat, props.long)) {
            setMapRegion({
                latitude: props.lat,
                longitude: props.long,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
            });
        } else {
            setMapRegion(DEFAULT_REGION);
        }
    }, [props.lat]);

    const loadData = async () => {
        setLoading(true);
        setDataError(null);
    
        if (validateCoordinate(props.lat, props.long)) {
            setMapRegion({
                latitude: props.lat,
                longitude: props.long,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
            });
        }
    
        try {
            const centerData = await fetchData(props.lat, props.long);
            setPollenData(centerData || null);
    
            const points = getPeripheralPoints(props.lat, props.long);
            if (points.length > 0) {
                const surroundingResults = await Promise.allSettled(
                    points.map(async (point) => {
                        return await fetchData(point.latitude, point.longitude);
                    })
                );
    
                const validData = surroundingResults
                    .filter(result => result.status === "fulfilled" && result.value)
                    .map(result => result.value);
    
                setPeripherals(validData);
            }
        } catch (err) {
            console.error('Error fetching pollen data:', err);
            setError(err);
            setPollenData(null);
            setPeripherals([]);
        } finally {
            setLoading(false);
        }
    };
    
    // when component mounts or coordinates change, guarantee map region will update
    useEffect(() => {
        loadData();
    }, [props.lat]);

    const getPeripheralPoints = (centerLat, centerLng) => {
        if (!validateCoordinate(centerLat, centerLng)){
            return [];
        }

        const points = [];
        const latOffset = 0.05;
        const lngOffset = 0.05;

        for(let i = -GRID_SIZE/2; i <= GRID_SIZE/2; i++){
            for(let j = -GRID_SIZE/2; j <= GRID_SIZE/2; j++){
                if(i === 0 && j === 0) continue;
                points.push({
                    latitude: centerLat + (i * latOffset),
                    longitude: centerLng + (j * lngOffset),
                });
            }
        }

        return points;
    }

      

    const fetchData = async(lat, long) => {
        if (!validateCoordinate(lat, long)) {
            throw new Error('Invalid coordinates');
        }
        try{
            const res = await axios.get(
            `https://api.ambeedata.com/latest/pollen/by-lat-lng?lat=${lat}&lng=${long}`,
                { headers: {'x-api-key': AMBEE_API_KEY, 'Content-Type': 'application/json'}}
            );
            
            if (!res.data.data || res.data.data.length === 0) {
                console.warn('No data available for the given location.');
                 return null;
             }

            // const data = res.data.data[0];
            const data = generateRandomData();
            return {
                grassCount: data.Count.grass_pollen,
                treeCount: data.Count.tree_pollen,
                weedCount: data.Count.weed_pollen,
                grassRisk: data.Risk.grass_pollen,
                treeRisk: data.Risk.tree_pollen,
                weedRisk: data.Risk.weed_pollen,
                species: data.Species,
                updatedAt: data.updatedAt, 
                coordinate: {latitude: lat, longitude: long}
            };
        } catch (err){
            console.error('Error: Unable to fetch pollen data from the location', err);
            throw err;
        }
    }

    const getColors = (level) => {
        const colors = {
            'Low': 'rgba(0, 255, 0, 0.3)',
            'Moderate': 'rgba(255, 255, 0, 0.3)',
            'High': 'rgba(255, 165, 0, 0.3)',
            'Very High': 'rgba(255, 0, 0, 0.3)'
        };
        return colors[level] || colors['Low'];
    };

    const getAverage = (pData) => {
        const levelToNum = { 'Low': 1, 'Moderate': 2, 'High': 3, 'Very High': 4 };
        const numToLevel = { 1: 'Low', 2: 'Moderate', 3: 'High', 4: 'Very High' };
        
        if (!pData?.treeRisk || !pData?.weedRisk || !pData?.grassRisk) return 'Low';
        let avg = (levelToNum[pData.treeRisk] + levelToNum[pData.weedRisk] + levelToNum[pData.grassRisk]) / 3;
        return numToLevel[Math.round(avg)];
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setDataError(null);
            
            if (!validateCoordinate(props.lat, props.long)) {
                setDataError('Invalid coordinates provided');
                setPollenData(null);
                setPeripherals([]);
                setLoading(false);
                return;
            }

            try {
                const centerData = await fetchData(props.lat, props.long);
                setPollenData(centerData || null);
                
                const points = getPeripheralPoints(props.lat, props.long);
                if (points.length > 0) {
                    const surroundingResults = await Promise.allSettled(
                        points.map(async (point) => {
                            return await fetchData(point.latitude, point.longitude);
                        })
                    );
    
                    const validData = surroundingResults
                        .filter(result => result.status === "fulfilled" && result.value)
                        .map(result => result.value);
    
                    setPeripherals(validData);
                }
            } catch (err) {
                setError(err);
                setPollenData(null);
                setPeripherals([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [props.lat, props.long]);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.forecastTitle}>Pollen Map</Text>
                {dataError && (
                    <Text style={styles.errorText}>{dataError}</Text>
                )}
            </View>

            <View style={styles.mapWrapper}>
                <MapView
                    style={styles.map}
                    initialRegion={mapRegion}
                    region={mapRegion}
                >
                    {pollenData && validateCoordinate(props.lat, props.long) && (
                        <>
                            <Marker
                                coordinate={{ 
                                    latitude: props.lat, 
                                    longitude: props.long 
                                }}
                                pinColor={getColors(getAverage(pollenData))}
                                title="Current Location"
                                description={`Grass: ${pollenData.grassCount}, Tree: ${pollenData.treeCount}, Weed: ${pollenData.weedCount}`}
                            />
                            <Circle
                                center={{ 
                                    latitude: props.lat, 
                                    longitude: props.long 
                                }}
                                radius={RADIUS}
                                fillColor={getColors(getAverage(pollenData))}
                                strokeColor="transparent"
                            />
                        </>
                    )}
                    {peripheralData.map((point, index) => (
                        point && (
                            <Circle
                                key={index}
                                center={point.coordinate}
                                radius={RADIUS * 0.8}
                                fillColor={getColors(getAverage(point))}
                                strokeColor="transparent"
                            />
                        )
                    ))}
                </MapView>
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="green"/>
                </View>
            )}

            <View style={styles.legend}>
                {['Low', 'Moderate', 'High', 'Very High'].map((level) => (
                    <View key={level} style={styles.legendItem}>
                        <View 
                            style={[
                                styles.legendColor, 
                                { backgroundColor: getColors(level).replace('0.3', '1') }
                            ]} 
                        />
                        <Text style={styles.legendText}>{level}</Text>
                    </View>
                ))}
            </View>
            
            {pollenData && (            
                <View style={styles.info}>
                    <Text style={styles.infoText}>Grass Pollen: {pollenData.grassCount} ({pollenData.grassRisk})</Text>
                    <Text style={styles.infoText}>Tree Pollen: {pollenData.treeCount} ({pollenData.treeRisk})</Text>
                    <Text style={styles.infoText}>Weed Pollen: {pollenData.weedCount} ({pollenData.weedRisk})</Text>
                    <Text style={styles.infoText}>Last Updated: {new Date(pollenData.updatedAt).toLocaleString()}</Text>
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: '90%',
        alignSelf: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    forecastTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.black,
        marginRight: 10,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
    },
    mapWrapper: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 15,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: -25}, {translateY: -25}],
    },

    legend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 10,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        marginBottom: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5,
    },
    legendText: {
        color: theme.colors.white,
        fontSize: 12,
    },
    info: {
        padding: 10,
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        width: '100%',
        alignItems: 'flex-start',
    },
    infoText: {
        color: theme.colors.white,
        fontSize: 14,
        marginBottom: 5,
    },
});