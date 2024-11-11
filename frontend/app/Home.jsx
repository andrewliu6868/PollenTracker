import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import ScreenWrap from '../components/ScreenWrap'
import { StatusBar } from 'expo-status-bar';
import Menu from '../assets/icons/Menu'
import { heightP, widthP } from '../style/deviceSpecs.js';
import { theme } from '../style/theme.js';
import React , {useState} from 'react'
import { useRouter } from 'expo-router'
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
            <View style={styles.container}>
                <TopBar title='PollenSense' router={router}/>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                <View style={styles.mapContainer}>
                    <HeatMap lat={45} long={-72}/>
                </View>
                <View>
                    <Forecast place={'california'}/>
                </View>
                
                </ScrollView>
        </ScreenWrap>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },

    scrollContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },

    mapContainer:{
        width: '90%',
        aspectRatio: 1,
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 20,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
    },
    
    forecastContainer: {
        width: '100%',
        paddingHorizontal: 20, // Adds padding to both sides of the forecast component
        marginVertical: 20,
    },

    top:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginHorizontal: widthP(5)
    },

    map: {
        flex: 1,
    },

    appName:{
        color: theme.colors.text,
        fontSize: heightP(3.5),
        fontWeight: theme.fonts.bold
    },

})