import React from 'react'
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'

const LoadingComponent = ({ message = 'Loading...' }) => {
  const { backgroundColor, textColor } = useThemeColor()
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: backgroundColor,
    },
    message: {
      marginTop: 10,
      fontSize: 16,
      color: 'gray',
    },
  })
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={textColor} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

export default LoadingComponent
