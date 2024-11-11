import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { getWeeklyJournalEntries } from "./api";
import { theme } from "../style/theme";

const screenWidth = Dimensions.get("window").width;
const chartSize = screenWidth * 0.8; // Adjust chart size based on screen width

export default function Insights() {
  const [topAllergens, setTopAllergens] = useState([]);
  const [topSymptoms, setTopSymptoms] = useState([]);
  const [educationalContent, setEducationalContent] = useState([]);
  const [recommendedActions, setRecommendedActions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pastWeekEntries = await getWeeklyJournalEntries();
        const allergensData = calculateTopAllergens(pastWeekEntries);
        const symptomsData = calculateTopSymptoms(pastWeekEntries);
        setTopAllergens(allergensData);
        setTopSymptoms(symptomsData);
        setEducationalContent(getEducationalContent(allergensData));
        setRecommendedActions(getRecommendedActions(allergensData));
      } catch (error) {
        console.error("Error fetching insights data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate top allergens
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

  // Calculate top symptoms
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

  // Educational content for allergens
  const getEducationalContent = (allergens) => {
    return allergens.map((allergen) => ({
      name: allergen.name,
      content: `Information about ${allergen.name}...`,
    }));
  };

  // Recommended actions based on allergens
  const getRecommendedActions = (allergens) => {
    return allergens.map((allergen) => ({
      name: allergen.name,
      actions: `Recommended actions to avoid ${allergen.name}...`,
    }));
  };

  // Generic color generation function
  const generateColor = (colors, index) => {
    return colors[index % colors.length];
  };


  const allergenData = topAllergens.map((a, index) => ({
    value: a.count,
    label: a.name,
    color: generateColor(theme.colors.gradients.green, index),
  }));

  const symptomData = topSymptoms.map((s, index) => ({
    value: s.count,
    label: s.name,
    color: generateColor(theme.colors.gradients.yellow, index),
  }));

  const renderLegend = (data) => {
    return (
      <View style={styles.horizontalLegendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insights</Text>

      {/* Top Allergens Doughnut Chart */}
      <Text style={styles.chartTitle}>Top Allergens</Text>
      {allergenData.length > 0 ? (
        <View style={{ alignItems: "center" }}>
          <PieChart
            data={allergenData}
            showText
            textColor={theme.colors.white}
            radius={chartSize / 2.5}
            innerRadius={chartSize / 4}
            centerLabelComponent={() => <Text style={styles.centerLabel}>Allergens</Text>}
          />
          {renderLegend(allergenData)}
        </View>
      ) : (
        <Text style={styles.noDataText}>No allergen data available for the past week.</Text>
      )}

      {/* Top Symptoms Doughnut Chart */}
      <Text style={styles.chartTitle}>Top Symptoms</Text>
      {symptomData.length > 0 ? (
        <View style={{ alignItems: "center" }}>
          <PieChart
            data={symptomData}
            showText
            textColor={theme.colors.white}
            radius={chartSize / 2.5}
            innerRadius={chartSize / 4}
            centerLabelComponent={() => <Text style={styles.centerLabel}>Symptoms</Text>}
          />
          <View style={styles.legendContainer}>{renderLegend(symptomData)}</View>
        </View>
      ) : (
        <Text style={styles.noDataText}>No symptom data available for the past week.</Text>
      )}
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
  chartTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: theme.colors.textLight,
  },
  centerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  horizontalLegendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 5,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: theme.colors.text,
  },
});