import { View, Text, Button } from 'react-native'
import { useRouter } from 'expo-router';
import ScreenWrap from '../components/ScreenWrap.jsx';
import React from 'react'

const index = () => {
const router = useRouter();
  return (
    <ScreenWrap>
        <View>
            <Text>Loading Screen</Text>
            <Button title="Go to Home" onPress={() => router.push('/Homepage')}></Button>
            <Button title="Welcome!" onPress={() => router.push('/Entrypage')}></Button>
        </View>
    </ScreenWrap>
  )
}

export default index