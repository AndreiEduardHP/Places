import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native'

import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import SvgComponent from '../Components/SVG/Logo'
import { LinearGradient } from 'expo-linear-gradient'
import SVGComponentPRO from '../Components/SVG/Shapes/ConnectPro'
import Svg, {
  Defs,
  Stop,
  TSpan,
  Text as T,
  LinearGradient as L,
} from 'react-native-svg'

const HomeScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser } = useUser()
  const { backgroundColor, textColor } = useThemeColor()

  const styles = StyleSheet.create({
    container: { backgroundColor: backgroundColor, flex: 1 },
    headerContainer: {
      marginTop: -30,
    },
    headerContainer1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      marginTop: 5,
      marginLeft: 20,

      fontSize: 34,
      letterSpacing: -0.51,
      fontWeight: '300',
      fontFamily: '',
      color: textColor,
    },
    headerTextAbout: {
      marginTop: 5,
      marginLeft: 20,

      fontSize: 34,

      letterSpacing: -0.51,
      fontWeight: '300',
      fontFamily: '',
      color: textColor,
    },
    contentContainer: {
      width: '100%',
      marginTop: 40,
      paddingHorizontal: 10,
    },
    image: {
      width: '100%',
      height: 250,
      borderBottomLeftRadius: 100,
      borderTopRightRadius: 150,
    },
    title: {
      fontFamily: 'Cochin',
      fontSize: 38,
      textAlign: 'center',
      fontWeight: '400',
      marginBottom: 10,
      color: 'white',
    },
    description: {
      fontSize: 16,
      color: textColor,
      lineHeight: 24,
      marginBottom: 20,
    },
    featuresTitle: {
      fontSize: 28,
      color: 'white',
      fontFamily: 'Cochin',
      fontWeight: '400',
      marginBottom: 10,
    },
    featuresText: {
      fontSize: 16,
      color: textColor,
      marginBottom: 5,
    },
    backgroundImage: {
      flex: 1,
      marginTop: -30,
      zIndex: -1,

      resizeMode: 'cover',
    },
  })
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/aboutUsImage.jpg')}
          style={styles.image}
        />
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'rgba(255, 255, 255,0)']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.headerContainer}>
          <View style={styles.headerContainer1}>
            <View>
              <Text style={[styles.headerTextAbout]}>{t('about')}</Text>
            </View>
            <View style={{ paddingTop: 9 }}>
              <SvgComponent></SvgComponent>
            </View>
          </View>
        </LinearGradient>
        <View
          style={{
            marginTop: -30,
            zIndex: -1,
            // alignItems: 'center',
            width: 222,
            backgroundColor: 'white',
          }}></View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('homeScreen.title')}</Text>
          <Text style={styles.description}>{t('homeScreen.description')}</Text>

          <Text style={styles.featuresTitle}>{t('homeScreen.features')}</Text>
          <Text style={styles.featuresText}>{t('homeScreen.discover')}</Text>
          <Text style={styles.featuresText}>{t('homeScreen.connect')}</Text>
          <Text style={styles.featuresText}>{t('homeScreen.access')}</Text>
          <Text style={styles.featuresText}>{t('homeScreen.stay')}</Text>
        </View>
      </ScrollView>

      <FooterNavbar currentRoute={''} />
    </View>
  )
}

export default HomeScreen
