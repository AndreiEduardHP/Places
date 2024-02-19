import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import StackNavigator from './src/Navigation/StackNavigator'
import Navbar from './src/Components/Navbar'
import {
  useFonts,
  OpenSans_300Light_Italic,
  OpenSans_300Light,
} from '@expo-google-fonts/open-sans'
import './src/TranslationFiles/i18n'
import { DarkModeProvider } from './src/Context/DarkModeContext'
import { UserProvider } from './src/Context/AuthContext'
import { TapGestureHandler } from 'react-native-gesture-handler'

const Stack = createStackNavigator()

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    OpenSans_300Light_Italic,
    OpenSans_300Light,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return <StackNavigator />
}
