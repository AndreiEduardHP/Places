import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, Platform, ImageBackground } from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import PeopleCard from '../Components/PeopleCard'
import PlacesBenefits from '../Components/PlacesBenefits'
import EventsAroundYou from '../Components/EventsAroundYou'
import { LinearGradient } from 'expo-linear-gradient'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'

const NewConnectionScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser } = useUser()
  const { backgroundColor, textColor } = useThemeColor()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    footer: {
      justifyContent: 'flex-end',
    },

    titleDear: {
      marginTop: 5,
      marginLeft: 20,

      fontSize: 34,
      letterSpacing: -0.51,
      fontWeight: '400',
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
  })
  return (
    <View style={styles.container}>
      {loggedUser ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: backgroundColor,
            }}>
            <Text style={styles.titleDear}>Dear {loggedUser.firstName}</Text>
          </View>

          <PeopleCard />

          <EventsAroundYou />
        </View>
      ) : (
        <Text>No user is logged in</Text>
      )}
      <View style={styles.footer}>
        <FooterNavbar currentRoute={'NewConnectionScreen'} />
      </View>
    </View>
  )
}

export default NewConnectionScreen
