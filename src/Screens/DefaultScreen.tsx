import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  Linking,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import MaskedView from '@react-native-community/masked-view'
import { StackNavigationProp } from '@react-navigation/stack'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DefaultScreen: React.FC = () => {
  const { t } = useTranslation()
  const opacityMember = useRef(new Animated.Value(0)).current
  const opacityLine = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current
  const deviceWidth = Dimensions.get('window').width
  const scaleX = useRef(new Animated.Value(0)).current
  const translateX = scaleX.interpolate({
    inputRange: [0, 1],
    outputRange: [deviceWidth / 2, 0], // Starts from half width to 0
  })

  const fadeAnimation = () => {
    // Set the initial values
    opacity.setValue(0)
    Animated.timing(opacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }
  const animateLine = () => {
    // Set the initial values
    opacityLine.setValue(0)
    scaleX.setValue(0)

    // Run the animation
    Animated.parallel([
      Animated.timing(opacityLine, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleX, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()
  }
  const alreadyMember = () => {
    // Set the initial values
    opacityMember.setValue(0)

    setTimeout(() => {
      Animated.timing(opacityMember, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start()
    }, 500) // Delay of 2 seconds (2000 milliseconds)
  }

  const handleNavigation = useHandleNavigation()

  useFocusEffect(
    React.useCallback(() => {
      animateLine()
      fadeAnimation()
      alreadyMember()
      return () => {
        // Optional: If you want to reset the animation when leaving the screen
        opacityLine.setValue(0)
        scaleX.setValue(0)
      }
    }, []),
  )
  useEffect(() => {
    // Check if the user is logged in using AsyncStorage
    const checkLoggedInStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (token) {
          // If user is logged in, navigate to the profile screen
          handleNavigation('ProfileScreen')
        }
      } catch (error) {
        console.error('Error checking logged in status:', error)
      }
    }
    checkLoggedInStatus()
  }, [])

  const handlePressSocialMedia = (url: string) => {
    return () => {
      Linking.openURL(url)
    }
  }

  return (
    <View
      style={{
        flex: 1,

        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('../../assets/world.png')}
        style={[styles.backgroundImage]}></Image>
      <View
        style={{ flex: 3, alignItems: 'center', height: 200, marginTop: 80 }}>
        <Animated.View style={{ opacity: opacity }}>
          <Text style={styles.welcome}>{t('defaultScreen.welcome')}</Text>
        </Animated.View>
        <Animated.View
          style={{
            height: 2,
            width: 400,
            backgroundColor: 'black',
            borderRadius: 10,
            opacity: opacityLine,
            transform: [{ scaleX: scaleX }],
          }}
        />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Animated.View style={{ opacity: opacityMember }}>
            <Text style={[styles.description, {}]}>
              {t('defaultScreen.description')}
            </Text>
          </Animated.View>
          <View>
            <Animated.View style={{ opacity: opacityMember }}>
              <Text style={[styles.joinPlaces, {}]}>
                {t('defaultScreen.joinPlaces')}
              </Text>
            </Animated.View>
            <Animated.View style={{ opacity: opacityMember }}>
              <Text style={[styles.motto, {}]}>{t('defaultScreen.motto')}</Text>
            </Animated.View>
          </View>
        </View>
      </View>

      <View style={[styles.logButtons]}>
        <View style={{ alignItems: 'center', marginRight: 30 }}>
          <Animated.View style={{ opacity: opacityMember }}>
            <Text style={styles.alreadyMember}>
              {t('defaultScreen.alreadyMember')}
            </Text>
          </Animated.View>
          <Animated.View style={{ opacity: opacityMember }}>
            <TouchableOpacity
              onPress={() => handleNavigation('LoginScreen')}
              style={styles.logBtn}>
              <View style={styles.clickToLogIn}>
                <Text style={styles.buttonLoginSubmit}>
                  {t('buttons.logIn')}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Animated.View style={{ opacity: opacityMember }}>
            <View>
              <Text style={styles.alreadyMember}>
                {t('defaultScreen.noAccount')}
              </Text>
            </View>
          </Animated.View>
          <Animated.View style={{ opacity: opacityMember }}>
            <TouchableOpacity
              onPress={() => handleNavigation('SignUp')}
              style={styles.logBtn}>
              <View style={styles.clickToLogIn}>
                <Text style={styles.buttonLoginSubmit}>
                  {t('buttons.signUp')}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            letterSpacing: -1,
            fontSize: 18,
          }}>
          Join Us on
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={handlePressSocialMedia('https://www.facebook.com')}>
          <Image
            source={require('../../assets/Icons/facebook.png')}
            style={{ width: 47, height: 47, marginRight: 20 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePressSocialMedia('https://www.instagram.com')}>
          <Image
            source={require('../../assets/Icons/instagram.png')}
            style={{ width: 47, height: 47, marginRight: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePressSocialMedia('https://www.facebook.com')}>
          <Image
            source={require('../../assets/Icons/twitter.png')}
            style={{ width: 47, height: 47 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 32,

    letterSpacing: -0.1,
    fontFamily: 'OpenSans_300Light',
    //fontWeight: '200',
    shadowColor: 'white', // white shadow color
    shadowOffset: { width: 1, height: 2 }, // no offset
    shadowOpacity: 1, // full opacity
    shadowRadius: 1, // shadow blur radius
    marginTop: -50,
  },
  backgroundImage: {
    width: '100%',
    position: 'absolute',
    height: 300,
    top: '15%',
  },
  alreadyMember: {
    marginTop: 50,
    fontSize: 18,
    letterSpacing: -0.1,
    fontFamily: 'OpenSans_300Light',
    //fontWeight: '200',
    shadowColor: 'white', // white shadow color
    shadowOffset: { width: 1, height: 2 }, // no offset
    shadowOpacity: 1, // full opacity
    shadowRadius: 1, // shadow blur radius
  },
  clickToLogIn: {
    backgroundColor: 'black',
    borderRadius: 10,
    //marginTop: 5,
  },
  buttonLoginSubmit: {
    padding: 5,
    color: 'white',
    fontSize: 18,
  },
  description: {
    fontSize: 16,
    color: 'black',

    letterSpacing: -0.1,
    fontFamily: 'OpenSans_300Light',
    //fontWeight: '200',
    shadowColor: 'white', // white shadow color
    shadowOffset: { width: 1, height: 2 }, // no offset
    shadowOpacity: 1, // full opacity
    shadowRadius: 1, // shadow blur radius
    marginHorizontal: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  logButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

    // padding: 10,
  },
  motto: {
    fontSize: 27,
    letterSpacing: -0.1,
    fontFamily: 'OpenSans_300Light',
    //fontWeight: '200',
    shadowColor: 'white', // white shadow color
    shadowOffset: { width: 1, height: 2 }, // no offset
    shadowOpacity: 1, // full opacity
    shadowRadius: 1, // shadow blur radius
    marginHorizontal: 10,
    textAlign: 'center',
    marginBottom: 150,

    fontWeight: '400',
    //fontFamily: 'OpenSans_300Light',
  },
  joinPlaces: {
    fontSize: 67,
    color: 'black',
    marginHorizontal: 20,
    textAlign: 'center',

    letterSpacing: -0.1,
    fontFamily: 'OpenSans_300Light',
    //fontWeight: '200',
    shadowColor: 'white', // white shadow color
    shadowOffset: { width: 1, height: 2 }, // no offset
    shadowOpacity: 1, // full opacity
    shadowRadius: 1, // shadow blur radius
  },
  logBtn: {
    //width: 00,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',

    letterSpacing: -0.1,
    fontFamily: 'OpenSans_300Light',
    //fontWeight: '200',
    shadowColor: 'white', // white shadow color
    shadowOffset: { width: 1, height: 2 }, // no offset
    shadowOpacity: 1, // full opacity
    shadowRadius: 1, // shadow blur radius
  },
})

export default DefaultScreen
