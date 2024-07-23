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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const handleNavigation = useHandleNavigation()
  const { loggedUser } = useUser()
  const { backgroundColor } = useThemeColor()

  return (
    <>
      {loggedUser ? (
        <View
          style={{
            backgroundColor: backgroundColor,
            //  position: 'absolute',
            width: '100%',
            zIndex: 2000,
          }}>
          <View style={styles.safeArea}>
            <Animated.View
              style={[
                styles.container,
                {
                  height: navbarHeight,
                  borderBottomLeftRadius: 30, // Add bottom left radius
                  borderBottomRightRadius: 30, // Add bottom right radius
                },
              ]}>
              <View style={styles.titleContainer}>
                <TouchableOpacity
                  onPress={() => handleNavigation('DefaultScreen')}>
                  <SvgComponent />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </View>
      ) : (
        ''
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2A272A',
  },
  safeArea: {
    width: '100%',
    backgroundColor: '#2A272A',
    borderBottomLeftRadius: 22,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 45,

    borderBottomRightRadius: 22,
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
