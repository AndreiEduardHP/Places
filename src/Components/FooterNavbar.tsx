import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  useColorScheme,
  ViewStyle,
  Platform,
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
import { SpeedDial } from '@rneui/base'

type FooterNavProps = {
  style?: TextStyle
  currentRoute: string
}

const FooterNavbar = ({ style, currentRoute }: FooterNavProps) => {
  const handleNavigation = useHandleNavigation()
  const { isDarkMode } = useDarkMode()
  const { textColor } = useThemeColor()
  const colorScheme = useColorScheme()
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()
  const iconTintColor = isDarkMode
    ? colorScheme === 'dark'
      ? 'white'
      : 'black'
    : 'white'

  const getMenuItemStyle = (route: string): ViewStyle => ({
    flexDirection: 'column',
    alignItems: 'center' as const,
    padding: 10,
    borderRadius: 50,
    backgroundColor: currentRoute === route ? '#00B0EF' : 'transparent',
  })

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#2A272A' : '#2A272A',
      paddingHorizontal: 50,
      paddingVertical: Platform.OS === 'ios' ? 14 : 10,
      marginVertical: Platform.OS === 'ios' ? 0 : -6,
      //  position: 'absolute',
      //   bottom: 0,
      width: '100%',
      zIndex: 2,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    icon: {},
    selectedIcon: {
      tintColor: '#00B0EF',
    },
    text: {
      fontWeight: '300',
      alignItems: 'center',
    },
    centralButton: {
      position: 'absolute',
      top: -10,
      backgroundColor: '#00B0EF',
      width: 50,
      height: 50,
      left: '50%',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',

      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      transform: [{ translateX: 20 }],
    },

    curve: {
      position: 'absolute',
      top: -15,
      width: 90,
      zIndex: -1,
      left: '50%',
      height: 180,
      transform: [{ translateX: -1 }],
      backgroundColor: isDarkMode ? '#2A272A' : '#2A272A',
      borderRadius: 40,
    },
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleNavigation('MapScreen')}>
        <Icon
          name="map"
          size={35}
          color={currentRoute === 'MapScreen' ? '#00B0EF' : 'white'}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => handleNavigation('MapScreen')}
        style={getMenuItemStyle('MapScreen')}>
        <Icon name="map" size={30} color={textColor} />
      </TouchableOpacity>*/}

      <View style={styles.centralButton}>
        <TouchableOpacity
          onPress={() => handleNavigation('NewConnectionScreen')}
          style={{ alignItems: 'center' }}>
          <Icon name="search" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity
        onPress={() => handleNavigation('NewConnectionScreen')}
        style={getMenuItemStyle('NewConnectionScreen')}>
        <Icon name="search" size={30} color={textColor} />
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => handleNavigation('SettingScreen')}
        //style={getMenuItemStyle('SettingScreen')}
      >
        <Icon
          name="settings"
          size={35}
          color={currentRoute === 'SettingScreen' ? '#00B0EF' : 'white'}
        />
      </TouchableOpacity>
      <View style={styles.curve} />
    </View>
  )
}

export default FooterNavbar
