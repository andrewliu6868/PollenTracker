import { View, TextInput, StyleSheet} from 'react-native'
import React from 'react'
import { heightP } from '../style/deviceSpecs'
import { theme } from '../style/theme'

export default function CustomInput(props) {
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
        {props.icon && props.icon}
      <TextInput style={{flex: 1}} placeholderTextColor={props.color} ref={props.inputRef && props.inputRef} {...props}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: heightP(7.5),
        borderWidth: 0.5,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 16,
        gap: 14
    }
})