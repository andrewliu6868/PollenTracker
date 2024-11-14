import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import ScreenWrap from '../components/ScreenWrap';
import { StatusBar } from 'expo-status-bar';
import Menu from '../assets/icons/Menu';
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Button from '../components/Button.jsx';
import TopBar from '../components/TopBar.jsx';
import MapView from 'react-native-maps';
import HeatMap from '../components/HeatMap.jsx';
import Forecast from '../components/Forecast.jsx';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    return (
        <ScreenWrap>
            {/* Top Bar */}
            <View style={styles.container}>
                <TopBar title='PollenSense' />
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                {/* HeatMap Section */}
                <View style={styles.mapContainer}>
                    <HeatMap lat={45} long={-72} />
                </View>

                {/* Forecast Section */}
                <Forecast place={'california'} />
            </ScrollView>
        </ScreenWrap>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },



    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginHorizontal: widthP(5),
    },

    map: {
        flex: 1,
    },

    appName: {
        color: theme.colors.text,
        fontSize: heightP(3.5),
        fontWeight: theme.fonts.bold,
    },
});
