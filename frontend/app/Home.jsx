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

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    return (
        <ScreenWrap>
            <View style={styles.container}>
                <TopBar title='PollenSense' router={router}/>
            </View>
                <MapView
                    style={styles.map}
                    initialRegion={{
                    latitude: 40.73061,
                    longitude: -73.935242,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                    }}
                >
                </MapView>

        </ScreenWrap>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
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