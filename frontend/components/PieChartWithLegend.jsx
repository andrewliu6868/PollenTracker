import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { theme } from "../style/theme";

const PieChartWithLegend = ({ data, chartSize, centerLabel }) => {
  const renderLegend = (data) => {
    const middleIndex = Math.ceil(data.length / 2);
    const firstColumn = data.slice(0, middleIndex);
    const secondColumn = data.slice(middleIndex);

    return (
      <View style={styles.legendContainer}>
        <View style={styles.legendColumn}>
          {firstColumn.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legendColumn}>
          {secondColumn.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.chartWrapper}>
      <PieChart
        data={data}
        showText
        textColor={theme.colors.white}
        radius={chartSize / 2.5}
        innerRadius={chartSize / 4}
        centerLabelComponent={() => (
          <Text style={styles.centerLabel}>{centerLabel}</Text>
        )}
      />
      {renderLegend(data)}
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    width: "50%",
    alignItems: "center",
  },
  centerLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  legendColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorBox: {
    width: 14,
    height: 14,
    marginRight: 5,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default PieChartWithLegend;
