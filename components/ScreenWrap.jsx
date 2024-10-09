import {View, Text} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function ScreenWrap ({children, background}){
    const {top} = useSafeAreaInsets();
    // adjust if device has an IPhone notch
    const paddingTop = (top > 0) ? top + 5: 30;

    return (
        <View style={{ 
            flex: 1, // ensures it takes the full space
            paddingTop,
            backgroundColor: background
          }}>
            <Text>Test</Text>
            {children}
        </View>
    )
}
 