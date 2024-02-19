import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextStyle,
  useColorScheme,
} from 'react-native'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useDarkMode } from '../Context/DarkModeContext'
import {
  darkModeBackGroundColorActive,
  darkModeBackGroundColorNotActive,
} from '../Utils.tsx/ComponentColors.tsx/BackGroundColor'

type FooterNavProps = {
  style?: TextStyle
  currentRoute: string
}

const FooterNavbar = ({ style, currentRoute }: FooterNavProps) => {
  const handleNavigation = useHandleNavigation()
  const { isDarkMode } = useDarkMode()
  const colorScheme = useColorScheme()
  const iconTintColor = isDarkMode
    ? colorScheme === 'dark'
      ? 'white'
      : 'black'
    : 'white'
  return (
    <View
      style={[
        styles.container,
        style,
        isDarkMode
          ? darkModeBackGroundColorActive
          : darkModeBackGroundColorNotActive,
      ]}>
      <TouchableOpacity
        onPress={() => handleNavigation('MapScreen')}
        style={styles.menuItem}>
        <Image
          source={require('../../assets/Icons/map.png')}
          style={
            currentRoute === 'MapScreen'
              ? styles.selectedIcon
              : { tintColor: iconTintColor }
          }
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          Map
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigation('HomeScreen')}
        style={styles.menuItem}>
        <Image
          source={require('../../assets/Icons/home.png')}
          style={
            currentRoute === 'HomeScreen'
              ? styles.selectedIcon
              : { tintColor: iconTintColor }
          }
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigation('NewConnectionScreen')}
        style={styles.menuItem}>
        <Image
          source={require('../../assets/Icons/add.png')}
          style={
            currentRoute === 'NewConnectionScreen'
              ? styles.selectedIcon
              : { tintColor: iconTintColor }
          }
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          New
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigation('ProfileScreen')}
        style={styles.menuItem}>
        <Image
          source={require('../../assets/Icons/user.png')}
          style={
            currentRoute === 'ProfileScreen'
              ? styles.selectedIcon
              : { tintColor: iconTintColor }
          }
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigation('SettingScreen')}
        style={styles.menuItem}>
        <Image
          source={require('../../assets/Icons/settings.png')}
          style={
            currentRoute === 'SettingScreen'
              ? styles.selectedIcon
              : { tintColor: iconTintColor }
          }
        />
        <Text style={[styles.text, { color: isDarkMode ? 'black' : 'white' }]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopColor: 'rgba(255,255,255,0.1)',
    //borderTopWidth: 1,
    padding: 2,
  },
  menuItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 16,
  },
  icon: {
    // width: 18,
    // height: 12,
  },
  selectedIcon: {
    // width: 28,
    // height: 28,
    tintColor: '#00B0EF',
  },
  text: {
    marginTop: 2,
    fontWeight: '400',
    alignItems: 'center',
  },
})

export default FooterNavbar
