import React, { useRef } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
} from 'react-native'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import SvgComponent from './SVG/Logo'
import { useUser } from '../Context/AuthContext'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const navbarHeight = useRef(new Animated.Value(42)).current
  const handleNavigation = useHandleNavigation()
  const { loggedUser } = useUser()
  const { backgroundColor } = useThemeColor()

  return (
    <>
      {loggedUser ? (
        <View
          style={{
            backgroundColor: backgroundColor,
            width: '100%',
            zIndex: 2000,
          }}>
          <View style={styles.safeArea}>
            <View
              style={[
                styles.container,
                {
                  height: navbarHeight,
                  borderBottomLeftRadius: 30,
                  borderBottomRightRadius: 30,
                },
              ]}>
              <View style={styles.titleContainer}>
                <TouchableOpacity
                  onPress={() => handleNavigation('HomeScreen')}>
                  <SvgComponent />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleNavigation('SettingScreen')}
                style={{ paddingHorizontal: 10 }}>
                <Icon name="menu" size={35} color={'white'} />
              </TouchableOpacity>
            </View>
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
    alignItems: 'center',
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
