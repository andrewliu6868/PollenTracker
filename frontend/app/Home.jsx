import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import ScreenWrap from '../components/ScreenWrap';
import { StatusBar } from 'expo-status-bar';
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import TopBar from '../components/TopBar.jsx';
import HeatMap from '../components/HeatMap.jsx';
import Forecast from '../components/Forecast.jsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    return (
        <ScreenWrap>
            <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
                <View style={styles.topBarContainer}>
                    <TopBar title='PollenSense' />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                    <View style={styles.mapContainer}>
                        <HeatMap lat={45} long={-72} />
                    </View>

                    <View style={styles.forecastWrapper}>
                        <Forecast place={'california'} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenWrap>
    );
}

const styles = StyleSheet.create({
    topBarContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: theme.colors.white,
    },

    scrollContentContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    mapContainer: {
        width: '90%',
        aspectRatio: 1,
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 20,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
    },

    forecastWrapper: {
        width: '90%',
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
});
