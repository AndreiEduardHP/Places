import * as React from 'react'
import 'react-native-gesture-handler'
import StackNavigator from './src/Navigation/StackNavigator'
import { LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeBaseProvider, Box } from 'native-base'

//LogBox.ignoreAllLogs(true)

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <StackNavigator />
      </SafeAreaProvider>
    </NativeBaseProvider>
  )
}
