import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { theme } from "../style/theme";
import allergenInformation from '../data/allergenInfo';





const AllergenInfoSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const data = Object.entries(allergenInformation);

  const renderDots = () => {
    return (
      <View style={styles.paginationDots}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const onPageSelected = (e) => {
    setCurrentPage(e.nativeEvent.position);
  };

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {data.map(([allergen, info], index) => (
          <View key={index} style={styles.pageContainer}>
            <View style={styles.card}>
              <View style={styles.headerContainer}>
                <Text style={styles.icon}>{info.icon}</Text>
                <Text style={styles.allergenName}>{allergen}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoTitle}>Where It's Found</Text>
                  <Text style={styles.infoText}>{info.location}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoTitle}>Seasonal Patterns</Text>
                  <Text style={styles.infoText}>{info.season}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoTitle}>How To Identify</Text>
                  <Text style={styles.infoText}>{info.identify}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </PagerView>
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 395,
  },
  pagerView: {
    height: "92%",
  },
  pageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    paddingTop: 15,
    padding: 24,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  allergenName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.primaryLight,
    marginBottom: 13,
  },
  infoSection: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textLight,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: theme.colors.primaryLight,
  },
});

export default AllergenInfoSection;