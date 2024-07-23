import { t } from 'i18next'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import PeopleCard from '../Components/PeopleCard'
import EventsAroundYou from '../Components/EventsAroundYou'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tab } from '@rneui/base'

const NewConnectionScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, refreshData } = useUser()
  const { backgroundColor, textColor } = useThemeColor()
  const [index, setIndex] = React.useState(0)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    tabItem: {
      color: textColor,
    },
    footer: {
      justifyContent: 'flex-end',
    },
    titleDear: {
      marginTop: 5,
      marginLeft: 20,
      fontSize: 28,
      letterSpacing: 1.21,
      fontWeight: '300',
      fontFamily: '',
      color: textColor,
    },
    subTitle: {
      marginLeft: 10,
      fontSize: 18,
      letterSpacing: -1,
      fontWeight: '400',
      fontFamily: '',
    },
    gradientOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 30, // Adjust the height as needed
      bottom: 0,
    },
  })

  useEffect(() => {
    console.log('aici sunt in new' + loggedUser?.phoneNumber)
    refreshData()
  }, [])

  return (
    <View style={styles.container}>
      {loggedUser ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: backgroundColor,
            }}>
            <Text style={styles.titleDear}>
              {t('newConnectionScreen.dear')} {loggedUser.lastName}{' '}
              {loggedUser.firstName}
            </Text>
          </View>
          <Tab value={index} onChange={setIndex}>
            <Tab.Item titleStyle={styles.tabItem}>People</Tab.Item>
            <Tab.Item titleStyle={styles.tabItem}>Events</Tab.Item>
          </Tab>
          {index === 0 && (
            <View style={{ flex: 1 }}>
              <PeopleCard />
              <LinearGradient
                colors={[
                  textColor === 'white'
                    ? 'rgba(0,0,0,1)'
                    : 'rgba(255,255,255,0.2)',
                  'transparent',
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradientOverlay}
              />
            </View>
          )}

          {index === 1 && <EventsAroundYou />}
          {/*   <LinearGradient
            colors={['rgba(0,0,0,1)', 'transparent']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={styles.gradientOverlay}
          />  */}
        </View>
      ) : (
        <Text>{t('noUserIsLoggedIn')}</Text>
      )}
      <View style={styles.footer}>
        <FooterNavbar currentRoute={'NewConnectionScreen'} />
      </View>
    </View>
  )
}

export default NewConnectionScreen
