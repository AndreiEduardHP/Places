import * as React from 'react'

import StackNavigator from './src/Navigation/StackNavigator'

import {
  useFonts,
  OpenSans_300Light_Italic,
  OpenSans_300Light,
} from '@expo-google-fonts/open-sans'
import './src/TranslationFiles/i18n'

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
