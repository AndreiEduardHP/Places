import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { useDarkMode } from '../Context/DarkModeContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  darkModeBackGroundColorActive,
  darkModeBackGroundColorNotActive,
} from '../Utils.tsx/ComponentColors.tsx/BackGroundColor'
import SvgComponent from './SVG/Logo'
import { useUser } from '../Context/AuthContext'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { i18n } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const navbarHeight = useRef(new Animated.Value(42)).current
  const [showButtonsAbout, setShowButtonsAbout] = useState(false)

  const buttonsOpacity = useRef(new Animated.Value(0)).current
  const { isDarkMode } = useDarkMode()
  const { textColor } = useThemeColor()

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
  const { loggedUser } = useUser()

  return (
    <>
      {loggedUser && (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <Animated.View
            style={[
              styles.container,
              isDarkMode
                ? darkModeBackGroundColorActive
                : darkModeBackGroundColorNotActive,
              {
                height: navbarHeight,
                borderBottomWidth: 1,
                borderColor: textColor,
              },
            ]}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                onPress={() => handleNavigation('DefaultScreen')}>
                <SvgComponent></SvgComponent>
              </TouchableOpacity>
            </View>

            {!loggedUser && (
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
                    <TouchableOpacity
                      onPress={() => handleNavigation('AboutUs')}>
                      <Text
                        style={[
                          styles.buttons,
                          { color: isDarkMode ? 'black' : 'white' },
                        ]}>
                        {t('aboutUs')}
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
            )}
          </Animated.View>
        </SafeAreaView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safeArea: {
    width: '100%',
    backgroundColor: 'black', // Ensures the SafeAreaView doesn't add unwanted colors
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
    fontWeight: '200',
    fontSize: 28,
    letterSpacing: -1,
  },
  buttons: {
    fontWeight: '300',
    fontSize: 14,
  },
})

export default Navbar
