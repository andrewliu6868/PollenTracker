import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { AMBEE_API_KEY } from "@env";
import forecastInfo from '../data/forecastData';

export default function Forecast({ place }) {
  const [forecastData, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocalDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
  };

  const fetchData = async (place) => {
    try {
      const res = await axios.get(
        `https://api.ambeedata.com/forecast/v2/pollen/120hr/by-place?place=${place}`,
        {
          headers: { "x-api-key": AMBEE_API_KEY },
        }
      );
      return res.data.data || [];
    } catch (err) {
      console.error("Error fetching data:", err);
      return [];
    }
  };

  useEffect(() => {
    const loadForecast = async () => {
      setLoading(true);
      try {
        // const data = await fetchData(place);
        const data = forecastInfo;
      
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
            weedLevel: curr.Count.weed_pollen,
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
    <View style={styles.reminderItem}>
      <Text style={styles.dayText}>{item.dayOfWeek}</Text>
      <View style={styles.iconRow}>
        <FontAwesome5 name="tree" size={20} color="#A5D6A7" />
        <Text style={styles.levelText}>Tree: {item.treeLevel}</Text>
      </View>
      <View style={styles.iconRow}>
        <FontAwesome5 name="seedling" size={20} color="#81C784" />
        <Text style={styles.levelText}>Grass: {item.grassLevel}</Text>
      </View>
      <View style={styles.iconRow}>
        <FontAwesome5 name="spa" size={20} color="#FFB74D" />
        <Text style={styles.levelText}>Weed: {item.weedLevel}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.forecastTitle}>Pollen Forecast</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={forecastData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <Text style={styles.noReminders}>No forecast data available</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    padding: 15,
    backgroundColor: "#1E1F28",
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  reminderItem: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  levelText: {
    fontSize: 14,
    color: "#A5D6A7",
    marginLeft: 10,
  },
  loadingText: {
    color: "#A5D6A7",
    marginTop: 10,
  },
  errorText: {
    color: "#FFB74D",
    marginTop: 10,
  },
  noReminders: {
    color: "#A5D6A7",
    marginTop: 10,
  },
});
