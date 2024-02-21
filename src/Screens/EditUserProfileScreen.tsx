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

const EditUserProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
        }}>
        <Text style={styles.text}>Edit User Profile</Text>
      </View>

      <UserProfileForm />
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  text: {
    fontSize: 27,
    color: 'white',
  },
})

export default EditUserProfileScreen
