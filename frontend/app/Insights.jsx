import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import PieChartWithLegend from "../components/PieChartWithLegend";
import AllergenInfoSection from "../components/AllergenInfoSection";
import CollapsibleList from "../components/CollapsibleList";
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import { getWeeklyJournalEntries } from "./api";
import { theme } from "../style/theme";
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get("window").width;
const chartSize = screenWidth * 0.5;
const gradient = theme.colors.gradients;

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
    color: gradient.green[index % gradient.green.length],
  }));

  const symptomData = topSymptoms.map((s, index) => ({
    value: s.count,
    label: s.name,
    color: gradient.yellow[index % gradient.yellow.length],
  }));

  return (
    <ScreenWrap>
       
      <LinearGradient style={styles.container} colors={theme.colors.gradients.green}>
          <TopBar title="Insights" />
        <ScrollView contentContainerStyle={styles.Insightscontainer}>
          <Text style={styles.title}>Your Allergies Last Week</Text>
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
          <View style={styles.learnContainer}>
            <Text style={styles.sectionTitle}>Learn About Your Top Allergens</Text>
            <AllergenInfoSection />
          </View>
          <View style={styles.tipsContainer}>
            <CollapsibleList/>
          </View>
        </ScrollView>
      </LinearGradient>
    </ScreenWrap>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Insightscontainer: {
    padding: 15,
  },
  title: {
    color: theme.colors.white,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: "bold",
  },
  chartsContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    padding: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderWidth: 1,
  },
  learnContainer: {
    marginTop: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    paddingTop: 15,
  },
  tipsContainer: {
    marginTop: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    paddingTop: 15,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 23,
    fontWeight: "bold",
  },
});
