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
                <TopBar title='PollenSense'/>
            </View>
            <ScrollView>
                <Text>Hello!</Text>
                <Button  text="Medication Page" loading={loading} onPress={() => {router.push('/Medication')}} />
            </ScrollView>

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
        width: '80%',
        height: '20%',
    },

    appName:{
        color: theme.colors.text,
        fontSize: heightP(3.5),
        fontWeight: theme.fonts.bold
    },

})