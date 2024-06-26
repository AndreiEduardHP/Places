import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Linking,
  ImageBackground,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Profile, useUser } from '../Context/AuthContext'
import * as Notifications from 'expo-notifications'
import { LinearGradient } from 'expo-linear-gradient'
import SvgComponent from '../Components/SVG/Logo'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import CustomSvgComponent from '../Components/SVG/Shapes/Star'
import SvgComponent2 from '../Components/SVG/Shapes/Wow'

const DefaultScreen: React.FC = () => {
  const { t } = useTranslation()
  const { handleLogin, updateNotificationToken } = useUser()
  const opacityMember = useRef(new Animated.Value(0)).current
  const opacityLine = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scaleX = useRef(new Animated.Value(0)).current

  const fadeAnimation = () => {
    opacity.setValue(0)
    Animated.timing(opacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }
  const animateLine = () => {
    opacityLine.setValue(0)
    scaleX.setValue(0)

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
    opacityMember.setValue(0)
    setTimeout(() => {
      Animated.timing(opacityMember, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start()
    }, 500)
  }

  const handleNavigation = useHandleNavigation()

  useFocusEffect(
    React.useCallback(() => {
      animateLine()
      fadeAnimation()
      alreadyMember()
      return () => {
        opacityLine.setValue(0)
        scaleX.setValue(0)
      }
    }, []),
  )
  const checkLoggedInStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        const userProfileString = await AsyncStorage.getItem('loggedUser')
        if (userProfileString) {
          const userProfile: Profile = JSON.parse(userProfileString)
          const token = (await Notifications.getExpoPushTokenAsync()).data
          updateNotificationToken(userProfile.id, token)
          handleLogin(userProfile.phoneNumber)
        }
      }
    } catch (error) {
      //  console.error('Error checking logged in status:', error)
    }
  }
  useEffect(() => {
    checkLoggedInStatus()
  }, [])

  const handlePressSocialMedia = (url: string) => {
    return () => {
      Linking.openURL(url)
    }
  }

  /* return (
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
          {t('defaultScreen.joinUsOn')}
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

  */
  const imageAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]

  const animateImage = (index: number) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(imageAnimations[index], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(imageAnimations[index], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }

  const interpolatedScale = imageAnimations.map((animation) =>
    animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    }),
  )

  const interpolatedRotation = imageAnimations.map((animation) =>
    animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    }),
  )

  const svgComponents = Array.from({ length: 5 }, (_, i) => ({
    style: {
      top: 2 + Math.random() * 500,
      left: 1 + Math.random() * 500,
    },
  }))

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      //  resizeMode="contain"
      style={styles.container}>
      <SvgComponent width="400" height="100"></SvgComponent>

      <View style={styles.imageGrid}>
        <Animated.View
          style={[
            styles.image1,
            {
              transform: [
                { scale: interpolatedScale[0] },
                { rotate: interpolatedRotation[0] },
              ],
            },
          ]}>
          <TouchableOpacity onPress={() => animateImage(0)}>
            <Image
              source={require('../../assets/OIP.jpeg')}
              style={styles.image1}
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.containerGradient}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', '#5151C6']}
            style={styles.gradient}
          />
        </View>
        <View style={styles.containerGradient2}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', '#5151C6']}
            style={styles.gradient}
          />
        </View>
        <View style={styles.containerGradient3}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', '#5151C6']}
            style={styles.gradient2}
          />
        </View>
        <View style={styles.containerGradient4}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', '#5151C6']}
            style={styles.gradient2}
          />
        </View>
        <Image
          source={require('../../assets/OIP1.jpeg')}
          style={[styles.image2]}
        />
        <Image
          source={require('../../assets/OIP2.jpeg')}
          style={[styles.image3]}
        />
        <Image
          source={require('../../assets/OIP3.jpeg')}
          style={[styles.image4]}
        />
        <Animated.View
          style={[
            styles.image1,
            {
              transform: [
                { scale: interpolatedScale[0] },
                { rotate: interpolatedRotation[0] },
              ],
            },
          ]}>
          <TouchableOpacity onPress={() => animateImage(0)}>
            <Image
              source={require('../../assets/OIP.jpeg')}
              style={styles.image1}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Text style={styles.footer}>SHARE - INSPIRE - CONNECT</Text>
      <View style={styles.containerGradientLines}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(122, 155, 155, 1)']}
          style={styles.gradient2}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigation('LoginScreen')}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    zIndex: -21,
  },
  face: { top: 0, left: 0, transform: [{ rotate: '-25deg' }] },
  face1: { top: 0, left: 210 },
  face2: { top: 430, left: 110 },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 40,
    color: 'white',
    marginBottom: 20,
  },
  imageGrid: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },

  image11: {
    position: 'absolute',
    top: 0,
    width: 130,
    height: 130,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 10,
  },
  image1: {
    position: 'absolute',
    top: 0,
    width: 130,
    height: 130,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 10,
  },
  containerGradient: {
    position: 'absolute',
    top: -15,
    width: 130,
    height: 130,
    zIndex: -1,
    transform: [{ rotate: '-135deg' }],
  },
  containerGradientLines: {
    width: '100%',
    height: 30,
    marginTop: -20,
  },
  containerGradient2: {
    position: 'absolute',
    top: 215,
    width: 130,
    height: 130,
    zIndex: -1,
    transform: [{ rotate: '45deg' }],
  },
  containerGradient3: {
    position: 'absolute',

    top: 100,
    right: 35,
    width: 130,
    height: 130,
    zIndex: -1,
    transform: [{ rotate: '-45deg' }],
  },
  containerGradient4: {
    position: 'absolute',
    top: 100,
    left: 35,
    width: 130,
    height: 130,
    zIndex: -1,
    transform: [{ rotate: '45deg' }],
  },
  gradient: {
    flex: 1,
    borderRadius: 8,
    opacity: 0.9,
  },
  gradient2: {
    flex: 1,
    borderRadius: 10,
    opacity: 0.45,
  },

  image2: {
    position: 'absolute',
    top: 100,
    left: 50,
    width: 130,
    height: 130,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 10,
  },
  image3: {
    position: 'absolute',
    top: 100,
    right: 50,
    width: 130,
    height: 130,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 10,
  },
  image4: {
    position: 'absolute',
    top: 200,
    width: 130,
    height: 130,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 10,
  },
  footer: {
    // fontFamily: 'Circular Std',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 17,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'white',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'rgba(208, 208, 208, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 15,
    width: 192, // button width
    height: 52,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 26,
  },
})

/*const styles = StyleSheet.create({
  welcome: {
    fontSize: 32,
    letterSpacing: -0.1,

    fontWeight: '300',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
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

    fontWeight: '300',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  clickToLogIn: {
    backgroundColor: 'black',
    borderRadius: 10,
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

    fontWeight: '300',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
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
  },
  motto: {
    fontSize: 27,
    letterSpacing: -0.1,

    shadowColor: 'white',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    marginHorizontal: 10,
    textAlign: 'center',
    marginBottom: 150,
    fontWeight: '300',
  },
  joinPlaces: {
    fontSize: 67,
    color: 'black',
    marginHorizontal: 20,
    textAlign: 'center',
    letterSpacing: -0.1,
    fontWeight: '300',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  logBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: -0.1,
    fontWeight: '300',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
}) */

export default DefaultScreen
