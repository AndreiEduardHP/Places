import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  useColorScheme,
} from 'react-native'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useDarkMode } from '../Context/DarkModeContext'
import {
  darkModeBackGroundColorActive,
  darkModeBackGroundColorNotActive,
} from '../Utils.tsx/ComponentColors.tsx/BackGroundColor'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

type FooterNavProps = {
  style?: TextStyle
  currentRoute: string
}

const FooterNavbar = ({ style, currentRoute }: FooterNavProps) => {
  const handleNavigation = useHandleNavigation()
  const { isDarkMode } = useDarkMode()
  const { textColor } = useThemeColor()
  const colorScheme = useColorScheme()
  const { t } = useTranslation()
  const iconTintColor = isDarkMode
    ? colorScheme === 'dark'
      ? 'white'
      : 'black'
    : 'white'

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      borderColor: textColor,
      borderTopWidth: 1,
      //borderTopWidth: 1,
      paddingTop: 5,
    },
    menuItem: {
      flexDirection: 'column',
      alignItems: 'center',
      // marginTop: 2,
      paddingHorizontal: 16,
    },
    icon: {},
    selectedIcon: {
      tintColor: '#00B0EF',
    },
    text: {
      // marginTop: 1,
      fontWeight: '400',
      alignItems: 'center',
    },
  })
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.container,

        isDarkMode
          ? darkModeBackGroundColorActive
          : darkModeBackGroundColorNotActive,
      ]}>
      <TouchableOpacity
        onPress={() => handleNavigation('MapScreen')}
        style={styles.menuItem}>
        <Icon
          name="map"
          size={26}
          color={currentRoute === 'MapScreen' ? '#00B0EF' : iconTintColor}
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          {t('footerNavbar.map')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigation('HomeScreen')}
        style={styles.menuItem}>
        <Icon
          name="home"
          size={26}
          color={currentRoute === 'HomeScreen' ? '#00B0EF' : iconTintColor}
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          {t('footerNavbar.home')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigation('NewConnectionScreen')}
        style={styles.menuItem}>
        <Icon
          name="add"
          size={26}
          color={
            currentRoute === 'NewConnectionScreen' ? '#00B0EF' : iconTintColor
          }
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          {t('footerNavbar.new')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigation('SettingScreen')}
        style={styles.menuItem}>
        <Icon
          name="settings"
          size={26}
          color={currentRoute === 'SettingScreen' ? '#00B0EF' : iconTintColor}
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          {t('footerNavbar.settings')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default FooterNavbar
