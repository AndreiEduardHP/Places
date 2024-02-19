// src/components/Navbar.tsx

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native'
import StackNavigator from '../Navigation/StackNavigator'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import DarkMode from './SwitchDarkMode'
import { useDarkMode } from '../Context/DarkModeContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import {
  darkModeFontColorActive,
  darkModeFontColorNotActive,
} from '../Utils.tsx/ComponentColors.tsx/TextColor'
import {
  darkModeBackGroundColorActive,
  darkModeBackGroundColorNotActive,
} from '../Utils.tsx/ComponentColors.tsx/BackGroundColor'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { i18n } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const navbarHeight = useRef(new Animated.Value(42)).current
  const [showButtonsAbout, setShowButtonsAbout] = useState(false)
  const [showButtonsLogin, setShowButtonsLogin] = useState(false)
  const [showButtonsSign, setShowButtonsSign] = useState(false)
  const [showButtonsEng, setShowButtonsEng] = useState(false)
  const [showButtonsRo, setShowButtonsRo] = useState(false)

  const buttonsOpacity = useRef(new Animated.Value(0)).current
  const { isDarkMode } = useDarkMode()

  const toggleNavbar = () => {
    setExpanded(!expanded)
    setShowButtonsAbout(!showButtonsAbout)

    // Start the animations together

    Animated.timing(navbarHeight, {
      toValue: expanded ? 42 : 212, // Toggle between the two heights
      duration: 450,
      useNativeDriver: false, // Height doesn't support native driver
    }).start()
    Animated.timing(buttonsOpacity, {
      toValue: showButtonsAbout ? 0 : 1, // Toggle opacity
      duration: 700,
      useNativeDriver: true, // Opacity does support native driver
    }).start()
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const handleNavigation = useHandleNavigation()

  return (
    <Animated.View
      style={[
        styles.container,
        isDarkMode
          ? darkModeBackGroundColorActive
          : darkModeBackGroundColorNotActive,
        { height: navbarHeight },
      ]}>
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            isDarkMode ? darkModeFontColorActive : darkModeFontColorNotActive,
          ]}
          onPress={() => handleNavigation('DefaultScreen')}>
          {title}
        </Text>
        <DarkMode />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={{}} onPress={toggleNavbar}>
          <View
            style={[
              isDarkMode
                ? darkModeBackGroundColorNotActive
                : darkModeBackGroundColorActive,
              { borderRadius: 10, width: 50, height: 6, margin: 2 },
            ]}
          />
          <View
            style={[
              isDarkMode
                ? darkModeBackGroundColorNotActive
                : darkModeBackGroundColorActive,
              { borderRadius: 10, width: 50, height: 6, margin: 2 },
            ]}
          />
          <View
            style={[
              isDarkMode
                ? darkModeBackGroundColorNotActive
                : darkModeBackGroundColorActive,
              { borderRadius: 10, width: 50, height: 6, margin: 2 },
            ]}
          />
        </TouchableOpacity>

        {showButtonsAbout && (
          <Animated.View
            style={{
              opacity: buttonsOpacity,
              alignItems: 'flex-end',
              margin: 2,
            }}>
            <TouchableOpacity onPress={() => handleNavigation('AboutUs')}>
              <Text
                style={[
                  styles.buttons,
                  { color: isDarkMode ? 'black' : 'white' },
                ]}>
                {t('aboutUs')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleNavigation('LoginScreen')}>
              <Text
                style={[
                  styles.buttons,
                  { color: isDarkMode ? 'black' : 'white' },
                ]}>
                {t('logIn')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleNavigation('SignUpScreen')}>
              <Text
                style={[
                  styles.buttons,
                  { color: isDarkMode ? 'black' : 'white' },
                ]}>
                {t('signUp')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeLanguage('en')}>
              <Text
                style={[
                  styles.buttons,
                  { color: isDarkMode ? 'black' : 'white' },
                ]}>
                {t('english')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeLanguage('ro')}>
              <Text
                style={[
                  styles.buttons,
                  { color: isDarkMode ? 'black' : 'white' },
                ]}>
                {t('romana')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // Customize the background color
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginLeft: 10,
    flexDirection: 'row',
    width: 130,
  },
  buttonsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  title: {
    fontFamily: 'OpenSans_300Light',
    fontWeight: '400',
    // color: 'white', // Customize the text color
    fontSize: 28, // Customize the text size
    letterSpacing: -1,
  },
  buttons: {
    fontFamily: 'OpenSans_300Light',
    fontWeight: 'bold',
    // color: 'white', // Customize the text color
    fontSize: 14, // Customize the text size
  },
})

export default Navbar
