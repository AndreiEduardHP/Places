import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
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
  PermissionsAndroid,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'
import * as Location from 'expo-location'
import CustomeMap from '../Components/MapRelated/Map'

type Marker = {
  latitude: number
  longitude: number
  key: string
}

const MapScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, handleLogout } = useUser()

  return (
    <View style={styles.container}>
      {loggedUser ? (
        <View style={{ flex: 1 }}>
          <CustomeMap />
        </View>
      ) : (
        <Text>No user is logged in</Text>
      )}
      <View>
        <FooterNavbar currentRoute={'MapScreen'} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default MapScreen
