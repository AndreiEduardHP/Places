import React from 'react'
import { View, Switch, StyleSheet, ViewStyle, Platform } from 'react-native'
import { useDarkMode } from '../Context/DarkModeContext'

interface DarkModeProps {
  style?: ViewStyle
}

const DarkMode: React.FC<DarkModeProps> = ({ style }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: '#767577', true: '#00B0EF' }}
        thumbColor={isDarkMode ? 'white' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleDarkMode}
        value={isDarkMode}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? 0 : 5,
  },
})

export default DarkMode
