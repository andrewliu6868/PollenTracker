import { View, Text, StyleSheet, Animated, FlatList } from 'react-native'
import React, {useState, useEffect, useRef}from 'react'
import Flower from '../assets/icons/Flower'
import axios from 'axios'
import { AMBEE_API_KEY } from '@env'
import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';


export default function Forecast(props){
    const [forecastData, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDay, setDay] = useState(null);
    const animation = useRef(new Animated.Value(1)).current;

    const getLocalDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]

        return daysOfWeek[date.getDay()];
    }


    const fetchData = async (place) => {
        try{
            const res = await axios.get(`https://api.ambeedata.com/forecast/v2/pollen/120hr/by-place?place=${place}`, {headers: {'x-api-key' : AMBEE_API_KEY, 'Content-type': "application/json"}})
            if (!res.data.data || res.data.data.length === 0) {
                console.warn('No data available for the given location.');
                return null;
            }
            data = res.data.data;
            return data
        } catch(err){
            console.error('Error: Unable to fetch data from the location',err)
            throw err
        }
    }

    const handlePress = (index) => {
        setDay(index);
        animation.setValue(0.9);
        Animated.spring(animation, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }

    useEffect(() => {
        const loadForecast = async () => {
            setLoading(true)
            try{
                const data = await fetchData(props.place)
                // forecastData should have the following fields: dayOfWeek, pollenColor, pollenLevel
                const newData = []
                const firstDays = new Set()
                for(let itr = 0; itr < data.length; itr++){
                    const curr = data[itr]
                    const date = getLocalDate(curr.time)
                    // only create cards for the first occurrence of each day
                    if(firstDays.has(date)){
                        continue;
                    }
                    firstDays.add(date)
                    const treeCount = curr.Count.tree_pollen;
                    const grassCount = curr.Count.grass_pollen;
                    const weedCount = curr.Count.weed_pollen;
                    const currInfo = {
                        dayOfWeek : date,
                        treeLevel : treeCount,
                        grassLevel : grassCount,
                        weedLevel : weedCount,
                    }
                    newData.push(currInfo)
                }
                console.log(newData.length)
                setData(newData)
            }catch(err){
                setError(err)
            }finally{
                setLoading(false)
            }
        }

        loadForecast();
    }, [props.place]);


    const renderItem = ({ item }) => (
        <View style={styles.row}>
          <Text style={styles.dayText}>{item.dayOfWeek}</Text>
          <View style={styles.iconRow}>
            <FontAwesome5 name="tree" size={20} color="green" />
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${item.treeLevel}%` }]} />
            </View>
            <Text style={styles.levelText}>{item.treeLevel}</Text>
          </View>
          <View style={styles.iconRow}>
            <FontAwesome5 name="seedling" size={20} color="darkgreen" />
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${item.grassLevel}%` }]} />
            </View>
            <Text style={styles.levelText}>{item.grassLevel}</Text>
          </View>
          <View style={styles.iconRow}>
            <FontAwesome5 name="spa" size={20} color="orange" />
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${item.weedLevel}%` }]} />
            </View>
            <Text style={styles.levelText}>{item.weedLevel}</Text>
          </View>
        </View>
      );
    
      return (
        <View style={styles.container}>
          <Text style={styles.forecastTitle}>5-Day Pollen Forecast</Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text>Error: {error}</Text>
          ) : (
            <FlatList
              data={forecastData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        padding: 20,
        backgroundColor: '#1E1F28',
        borderRadius: 10,
      },
      forecastTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
      },
      row: {
        flexDirection: 'column',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 10,
      },
      dayText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
      },
      iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      barContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        marginHorizontal: 10,
      },
      bar: {
        height: 8,
        backgroundColor: '#00BCD4',
        borderRadius: 4,
      },
      levelText: {
        width: 40,
        textAlign: 'right',
        color: '#fff',
      },
    });