// Import necessary components from react-native
import React from 'react'
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'

// Define the LoadingComponent
const LoadingComponent = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

// Style the component
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Optional: Change the background color
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray', // Customize the text color as needed
  },
})

export default LoadingComponent
