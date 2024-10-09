import {View, Text, Button} from 'react-native';
import React from 'react';
import {useRouter} from 'expo-router';
import {ScreenWrap} from '../components/ScreenWrap.jsx';


export default function Loading(){
    // setup router 
    const router = useRouter();
    return(
        <ScreenWrap>
            <View>
                <Text>Loading Screen</Text>
                <Button title="Go to Home" onPress={() => router.push('/homepage')}></Button>
            </View>
        </ScreenWrap>

    );
}