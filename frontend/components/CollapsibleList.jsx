import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import Collapsible from "react-native-collapsible";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../style/theme";
import tipsData from "../data/allergyTips";



const CollapsibleList = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [rotationAnimations] = useState(() => 
    tipsData.map(() => new Animated.Value(0))
  );

  const toggleCollapsible = (index) => {
    // Animate icon rotation
    Animated.timing(rotationAnimations[index], {
      toValue: activeIndex === index ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setActiveIndex(activeIndex === index ? null : index);
  };

  const getRotationStyle = (index) => ({
    transform: [
      {
        rotate: rotationAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Management Tips</Text>
      {tipsData.map((tip, index) => (
        <Animated.View 
          key={index} 
          style={[
            styles.card,
            {
              transform: [{
                scale: activeIndex === index ? 1.02 : 1
              }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => toggleCollapsible(index)}
            style={[
              styles.header,
              activeIndex === index && styles.activeHeader
            ]}
          >
            <View style={styles.headerLeft}>
              <MaterialIcons 
                name={tip.icon} 
                size={24} 
                color="#fff" 
                style={styles.headerIcon}
              />
              <Text style={styles.headerText}>{tip.title}</Text>
            </View>
            <Animated.View style={getRotationStyle(index)}>
              <MaterialIcons 
                name="expand-more" 
                size={24} 
                color="#fff"
              />
            </Animated.View>
          </TouchableOpacity>
          <Collapsible collapsed={activeIndex !== index}>
            <View style={styles.content}>
              <Text style={styles.contentText}>{tip.content}</Text>
            </View>
          </Collapsible>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: theme.colors.black,
    textAlign: "center",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  activeHeader: {
    backgroundColor: theme.colors.primaryLight,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },
  content: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
  },
});

export default CollapsibleList;