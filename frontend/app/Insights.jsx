import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import PieChartWithLegend from "../components/PieChartWithLegend";
import { getWeeklyJournalEntries } from "./api";
import { theme } from "../style/theme";

const screenWidth = Dimensions.get("window").width;
const chartSize = screenWidth * 0.5;

export default function Insights() {
  const [topAllergens, setTopAllergens] = useState([]);
  const [topSymptoms, setTopSymptoms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pastWeekEntries = await getWeeklyJournalEntries();
        const allergensData = calculateTopAllergens(pastWeekEntries);
        const symptomsData = calculateTopSymptoms(pastWeekEntries);
        setTopAllergens(allergensData);
        setTopSymptoms(symptomsData);
      } catch (error) {
        console.error("Error fetching insights data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateTopAllergens = (entries) => {
    const allergenCounts = {};
    entries.forEach((entry) => {
      entry.topAllergens.forEach((allergen) => {
        const { name, count } = allergen;
        if (count > 0) {
          allergenCounts[name] = (allergenCounts[name] || 0) + count;
        }
      });
    });
    return Object.entries(allergenCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const calculateTopSymptoms = (entries) => {
    const symptomCounts = {};
    entries.forEach((entry) => {
      entry.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });
    return Object.entries(symptomCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const allergenData = topAllergens.map((a, index) => ({
    value: a.count,
    label: a.name,
    color: theme.colors.gradients.green[index % theme.colors.gradients.green.length],
  }));

  const symptomData = topSymptoms.map((s, index) => ({
    value: s.count,
    label: s.name,
    color: theme.colors.gradients.yellow[index % theme.colors.gradients.yellow.length],
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insights</Text>
      <View style={styles.chartsContainer}>
        <PieChartWithLegend
          data={allergenData}
          chartSize={chartSize}
          centerLabel="Top Allergens"
        />
        <PieChartWithLegend
          data={symptomData}
          chartSize={chartSize}
          centerLabel="Top Symptoms"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
