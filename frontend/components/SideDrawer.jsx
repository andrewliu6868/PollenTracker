import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../style/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

export default function SideDrawer({ visible, onClose }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState("");
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  const menuItems = [
    { label: "Home", icon: "home", route: "/Home", id: "first" },
    {
      label: "Medication Tracker",
      icon: "pill",
      route: "/Medication",
      id: "second",
    },
    {
      label: "Symptom Journal",
      icon: "notebook",
      route: "/Journal",
      id: "third",
    },
    { label: "Insights", icon: "chart-line", route: "/Insights", id: "fourth" },
  ];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: DRAWER_WIDTH,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible]);

  const handleNav = (route, item) => {
    if (route) {
      setActive(item);
      router.push(route);
      onClose();
      Animated.spring(slideAnim, {
        toValue: DRAWER_WIDTH,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      alert("Page not ready");
    }
  };

  const handleClose = () => {
    Animated.spring(slideAnim, {
      toValue: DRAWER_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
    onClose();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.push('/Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.overlay, { opacity: visible ? 1 : 0 }]}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top, // Add top padding for safe area
              paddingBottom: insets.bottom, // Add bottom padding for safe area
            },
          ]}
        >
          <View style={[styles.menuContainer, { paddingTop: 10 }]}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  active === item.id && styles.activeMenuItem,
                ]}
                onPress={() => handleNav(item.route, item.id)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={active === item.id ? "#fff" : "#2c3e50"}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    active === item.id && styles.activeMenuItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.footer, { marginBottom: insets.bottom }]}>
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={handleLogout}
            >
              <MaterialCommunityIcons name="logout" size={24} color="#e74c3c" />
              <Text style={styles.footerText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: "#f8f9fa",
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 20,
    marginBottom: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  activeMenuItem: {
    backgroundColor: "#3498db",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#2c3e50",
  },
  activeMenuItemText: {
    color: "#fff",
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 15,
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "500",
  },
});