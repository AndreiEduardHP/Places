import * as React from 'react'
import 'react-native-gesture-handler'
import StackNavigator from './src/Navigation/StackNavigator'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeBaseProvider, Box } from 'native-base'

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <StackNavigator />
      </SafeAreaProvider>
    </NativeBaseProvider>
  )
}
