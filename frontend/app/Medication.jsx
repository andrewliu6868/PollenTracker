import { View, Text, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';
import ScreenWrap from '../components/ScreenWrap';
import TopBar from '../components/TopBar';
import {useRouter} from 'expo-router';
import Button from '../components/Button';
import React, {useState} from 'react';
import {DataTable} from 'react-native-paper'
import { heightP, widthP } from '../style/deviceSpecs';

export default function Medication(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return (
        <ScreenWrap>
            <View style={styles.container}>
                <TopBar title = "Medication"></TopBar>
                <DataTable />

                <Button text="Add New Medication" loading={loading} onPress={() => {router.push('/Medication')}}/>
            </View>

        </ScreenWrap>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
