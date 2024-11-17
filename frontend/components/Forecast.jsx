import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { AMBEE_API_KEY } from "@env";
import { theme } from '../style/theme';

export default function Forecast({ place }) {
  const [forecastData, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocalDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
  };

  const fetchData = async (place) => {
    try {
      const res = await axios.get(
        `https://api.ambeedata.com/forecast/v2/pollen/120hr/by-place?place=${place}`,
        { headers: { "x-api-key": AMBEE_API_KEY } }
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
        const data = fetchData(place); 
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
    <View style={styles.card}>
      <Text style={styles.dayText}>{item.dayOfWeek}</Text>
      <View style={styles.iconRow}>
        <FontAwesome5 name="tree" size={18} color="#A5D6A7" />
        <Text style={styles.levelText}>Tree: {item.treeLevel}</Text>
      </View>
      <View style={styles.iconRow}>
        <FontAwesome5 name="seedling" size={18} color="#81C784" />
        <Text style={styles.levelText}>Grass: {item.grassLevel}</Text>
      </View>
      <View style={styles.iconRow}>
        <FontAwesome5 name="spa" size={18} color="#FFB74D" />
        <Text style={styles.levelText}>Weed: {item.weedLevel}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.forecastTitle}>5 Day Pollen Forecast</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={forecastData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>No forecast data available</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.black,
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#2E7D32",
    width: 180,
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  errorText: {
    color: "#FF5252",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    color: "#A5D6A7",
    textAlign: "center",
    marginTop: 20,
  },
});
