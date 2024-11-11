import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, {useState, useEffect}from 'react'
import Flower from '../assets/icons/Flower'
import axios from 'axios'
import { AMBEE_API_KEY } from '@env'

export default function Forecast(props){
    const [forecastData, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getLocalDate = (timestamp) => {
        const date = new Date(timestamp * 1000);

        const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]

        return daysOfWeek[date.getDay()];
    }

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

    const fetchData = async (place) => {
        try{
            const res = await axios.get(`https://api.ambeedata.com/forecast/pollen/by-place?place=${place}`, {headers: {'x-api-key' : AMBEE_API_KEY, 'Content-type': "application/json"}})
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

    useEffect(() => {
        const loadForecast = async () => {
            try{
                const data = await fetchData(props.place)
                // forecastData should have the following fields: dayOfWeek, pollenColor, pollenLevel
                const newData = []
                for(let itr = 0; itr < data.length; itr++){
                    const curr = data[itr]
                    const date = getLocalDate(curr)
                    const avg = getAverage(curr)
                    const color = getColor(avg)
                    const currInfo = {
                        dayOfWeek : date,
                        pollenColor : avg,
                        pollenLevel : color,
                    }
                    newData.push(currInfo)
                }
                setData(newData)
            }catch(err){
                setError(err)
            }finally{
                setLoading(false)
            }
        }

        loadForecast();
    }, [props.place]);


    return (
        <View style={styles.container}>
            <Text style={styles.forecastTitle}>Daily Forecast</Text>
            <ScrollView horizontal contentContainerStyle={styles.scrollContainer} showHorizontalScrollIndicator={true}>
                {forecastData.map((item,index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardText}>{item.dayOfWeek}</Text>
                        <Text style={styles.cardText}>{item.color}</Text>
                        <Text style={styles.cardText}>{item.pollen_level}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    forecastTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardStyle: {
        backgroundColor: '#9EF9E4',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifYContent: 'center',
        marginRight: 15,
        width: 100,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    }


})
