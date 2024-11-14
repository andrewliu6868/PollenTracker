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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    return (
        <ScreenWrap>
            <LinearGradient colors={['#2E7D32', '#A5D6A7']} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
                    <View style={styles.topBarContainer}>
                        <TopBar title='PollenSense' />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                        {/* HeatMap Section */}
                        <View style={styles.mapContainer}>
                            <HeatMap lat={45} long={-72} />
                        </View>

                        <View style={styles.forecastWrapper}>
                            <Forecast place={'california'} />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </ScreenWrap>
    );
}

const styles = StyleSheet.create({
    topBarContainer: {
        width: '100%',
        height: 60, // Ensure consistent height
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },

    scrollContentContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },


    mapContainer: {
        width: '95%',
        padding: 15,
        backgroundColor: '#1E1F28',
        borderRadius: 15,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    
    forecastWrapper: {
        width: '95%',
        padding: 15,
        backgroundColor: '#1E1F28',
        borderRadius: 15,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
});
