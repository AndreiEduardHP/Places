import React, { useState } from 'react'
import { View, Switch, StyleSheet, ViewStyle, Platform } from 'react-native'
import { useDarkMode } from '../Context/DarkModeContext'

interface DarkModeProps {
  style?: ViewStyle // This tells TypeScript that the component can accept style prop which is optional
}

const DarkMode: React.FC<DarkModeProps> = ({ style }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleDarkMode}
        value={isDarkMode}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? 0 : 5,
  },
})

export default DarkMode
