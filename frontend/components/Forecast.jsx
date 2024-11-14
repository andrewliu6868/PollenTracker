import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { AMBEE_API_KEY } from '@env';

export default function Forecast({ place }) {
  const [forecastData, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocalDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
  };

  const fetchData = async (place) => {
    try {
      const res = await axios.get(`https://api.ambeedata.com/forecast/v2/pollen/120hr/by-place?place=${place}`, {
        headers: { 'x-api-key': AMBEE_API_KEY }
      });
      return res.data.data || [];
    } catch (err) {
      console.error('Error fetching data:', err);
      return [];
    }
  };

  useEffect(() => {
    const loadForecast = async () => {
      setLoading(true);
      try {
        const data = await fetchData(place);
        const newData = [];
        const firstDays = new Set();

        for (let i = 0; i < data.length; i++) {
          const curr = data[i];
          const date = getLocalDate(curr.time);
          if (firstDays.has(date)) continue;
          firstDays.add(date);

          newData.push({
            dayOfWeek: date,
            treeLevel: curr.Count.tree_pollen,
            grassLevel: curr.Count.grass_pollen,
            weedLevel: curr.Count.weed_pollen
          });
        }
        setData(newData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, [place]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.dayText}>{item.dayOfWeek}</Text>
      <View style={styles.iconRow}>
        <FontAwesome5 name="tree" size={20} color="green" />
        <Text style={styles.levelText}>Tree: {item.treeLevel}</Text>
      </View>
      <View style={styles.iconRow}>
        <FontAwesome5 name="seedling" size={20} color="darkgreen" />
        <Text style={styles.levelText}>Grass: {item.grassLevel}</Text>
      </View>
      <View style={styles.iconRow}>
        <FontAwesome5 name="spa" size={20} color="orange" />
        <Text style={styles.levelText}>Weed: {item.weedLevel}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.forecastTitle}>Pollen Forecast</Text>
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  levelText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
  },
});
