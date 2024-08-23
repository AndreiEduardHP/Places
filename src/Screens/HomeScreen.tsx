import { t } from 'i18next'
import React from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import SvgComponent from '../Components/SVG/Logo'
import { LinearGradient } from 'expo-linear-gradient'

const HomeScreen: React.FC = () => {
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

      //  letterSpacing: -0.51,
      fontWeight: '500',
      fontFamily: '',
      color: '#00B0EF',
    },
    contentContainer: {
      width: '100%',
      marginTop: 30,
      paddingHorizontal: 10,
    },
    image: {
      width: '100%',
      height: 210,
      borderBottomLeftRadius: 100,
      borderTopRightRadius: 150,
    },
    title: {
      //  fontFamily: 'Cochin',
      fontSize: 29,
      textAlign: 'center',
      fontWeight: '300',
      marginBottom: 4,
      color: textColor,
    },
    description: {
      fontSize: 14,
      color: textColor,
      lineHeight: 24,
      marginBottom: 4,
    },
    featuresTitle: {
      fontSize: 26,
      color: textColor,
      // fontFamily: 'Cochin',
      fontWeight: '400',
      marginBottom: 8,
    },
    featuresText: {
      fontSize: 14,
      color: textColor,
      marginBottom: 4,
    },
    backgroundImage: {
      flex: 1,
      marginTop: -30,
      zIndex: -1,

      resizeMode: 'cover',
    },
  })
  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
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
            <View style={{ paddingTop: 9 }}>
              <SvgComponent width={200} height={50}></SvgComponent>
            </View>
          </View>
        </LinearGradient>
        <View
          style={{
            marginTop: -30,
            zIndex: -1,
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
