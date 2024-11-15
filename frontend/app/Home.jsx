import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import ScreenWrap from '../components/ScreenWrap';
import { StatusBar } from 'expo-status-bar';
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TopBar from '../components/TopBar.jsx';
import HeatMap from '../components/HeatMap.jsx';
import Forecast from '../components/Forecast.jsx';
import TodaysReminders from '../components/TodaysReminders.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const renderComponents = [
        {key: 'today', render: () => <TodaysReminders/>},
        {key: 'forecast', render: () => <Forecast place ="Vancouver"/>},
        {key: 'heatmap', render: () => <HeatMap lat={45} long={-72}/>}
    ]

    return (
        <ScreenWrap>
            <View style={styles.topBarContainer}>
                <TopBar title='PollenSense' />
            </View>
            <LinearGradient colors={['#2E7D32', '#A5D6A7']} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
                <FlatList
                    data={renderComponents}
                    renderItem={({ item }) => item.render()}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.scrollContentContainer}
                />
                </SafeAreaView>
            </LinearGradient>
        </ScreenWrap>
    );
}

const styles = StyleSheet.create({
    topBarContainer: {
      width: '100%',
      height: 60,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    scrollContentContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
  });
  


