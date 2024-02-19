import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
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
  FlatList,
  Animated,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import MapView, { Marker } from 'react-native-maps'
import { ImageConfig } from '../config/imageConfig'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { LinearGradient } from 'expo-linear-gradient'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../Navigation/Types'
import UserProfileForm from '../Components/UpdateUser'

interface Event {
  id: number
  eventImage: string
}

const HomeScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, handleLogout } = useUser()
  const [events, setEvents] = useState([])
  const animatedValue = useRef(new Animated.Value(0)).current
  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>()
  const personData = route.params?.personData

  useEffect(() => {
    fetchEvents()
    console.log(personData)
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/Event`)
      setEvents(response.data) // Update events state with fetched data
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }
  useEffect(() => {
    // Function to start the animation
    const startAnimation = () => {
      // Reset animation to 0
      animatedValue.setValue(0)
      // Start the animation
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000, // Duration of one cycle
        useNativeDriver: true, // Enable native driver for better performance
      }).start(() => startAnimation()) // Loop the animation
    }

    startAnimation()
  }, [animatedValue])

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0], // Adjust based on the size of your gradient
  })

  return (
    <View style={styles.container}>
      <Text style={{ flex: 0 }}>Home screen</Text>

      <UserProfileForm />
      <FooterNavbar currentRoute={'HomeScreen'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  eventItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  eventName: {
    marginLeft: 10,
  },
})

export default HomeScreen
