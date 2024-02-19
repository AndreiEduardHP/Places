import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import MapView, { Marker } from 'react-native-maps'
import PeopleCard from '../Components/PeopleCard'
import PlacesBenefits from '../Components/PlacesBenefits'
import EventsAroundYou from '../Components/EventsAroundYou'
import { LinearGradient } from 'expo-linear-gradient'

const NewConnectionScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, handleLogout } = useUser()

  return (
    <LinearGradient
      colors={[
        'rgba(255, 255, 255, 1)', // White
        'rgba(255, 255, 255, 1)', // White (you can adjust the number of whites based on how long you want the white part to extend)
        'rgba(245, 245, 245, 1)', // Near white to start the transition
        'rgba(235, 235, 235, 1)', // Light gray to further the transition
        'rgba(225, 225, 225, 0.7)', // Lighter gray with slight transparency
        'rgba(200, 200, 200, 0.5)', // Medium gray with more transparency
        'rgba(175, 215, 237, 0.3)', // Soft blue with transparency
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <View style={styles.container}>
        {loggedUser ? (
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: 'black',
                borderTopColor: 'rgba(255,255,255,0.4)',
                borderTopWidth: 1,
              }}>
              <Text style={styles.titleDear}>Dear {loggedUser.firstName}</Text>
            </View>

            <Text style={styles.title}>People around you</Text>
            <PeopleCard />
            <Text style={styles.title}>Events around you</Text>
            <EventsAroundYou />
            <Text style={styles.title}>Premium user benefits</Text>
            <PlacesBenefits />
          </View>
        ) : (
          <Text>No user is logged in</Text>
        )}

        {/* Place FooterNavbar at the bottom */}
        <View style={styles.footer}>
          <FooterNavbar currentRoute={'NewConnectionScreen'} />
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  title: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 22,
    paddingLeft: 10,
    letterSpacing: -0.6,
    fontWeight: '400',
    fontFamily: 'Arial',
    ...Platform.select({
      ios: {
        textShadowColor: '#FFFFFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  titleDear: {
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 5,

    fontSize: 24,
    letterSpacing: -0.1,
    fontWeight: '300',
    fontFamily: '',
    color: 'white',
  },
  subTitle: {
    marginLeft: 10,
    fontSize: 18,
    letterSpacing: -1,
    fontWeight: '400',
    fontFamily: '',
  },
})

export default NewConnectionScreen
