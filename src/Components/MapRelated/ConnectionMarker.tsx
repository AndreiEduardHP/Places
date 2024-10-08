import React, { useEffect, useRef, useState } from 'react'
import { Callout, Marker } from 'react-native-maps'
import { MapMarkerProps } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useUser } from '../../Context/AuthContext'
import { t } from 'i18next'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { Skeleton } from '@rneui/base'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import WebView from 'react-native-webview'

interface ConnectionMarkerProps extends MapMarkerProps {
  latitude: number
  longitude: number
  senderName: string | undefined
  senderPicture: string | undefined
  status: string
  personData: {
    friendRequestStatus: string
    areFriends: boolean
    id: number
    username: string
    firstName: string
    lastName: string
    phoneNumber: string
    description: string
    email: string
    interest: string
    profilePicture: string
    city: string
    currentLocationId: number
    notificationToken: string
  }
}

const ConnectionMarker: React.FC<ConnectionMarkerProps> = ({
  latitude,
  longitude,
  senderName,
  senderPicture,
  personData,
  status,
}) => {
  const { loggedUser } = useUser()
  const [loading, setLoading] = useState(true)
  const markerRef = useRef<any>()
  const navigate = useHandleNavigation()
  const generateHTMLForImage = (imageUri: string) => {
    return `
      <html>
        <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center;">
          <img src="${imageUri}" style="width: 100%; height: 100%; object-fit: cover;" />
        </body>
      </html>
    `
  }
  return (
    <Marker
      ref={markerRef}
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      title={`${t('map.event')}: ${senderName}`}
      description={`${t('map.description')}: ${senderName} ${senderName}`}
      onCalloutPress={() => {
        if (Platform.OS === 'android') {
          navigate('SelectedPersonInfo', { personData })
        }
      }}>
      <View style={styles.markerContainer}>
        <Text style={styles.markerText}>{senderName}</Text>

        {/* Container pentru icon și imagine */}
        <View style={styles.iconContainer}>
          {/* Iconița de fundal */}
          <Icon name="place" size={80} color="rgba(183,251,255,1)" />

          {/* Imaginea în centru */}
          <Image
            source={{ uri: senderPicture }}
            style={styles.iconImage}
            resizeMode="cover"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && (
            <Skeleton
              animation="wave"
              style={[styles.iconImage, { position: 'absolute', zIndex: 1 }]}
            />
          )}
        </View>
      </View>

      <Callout>
        <TouchableOpacity
          onPress={() => navigate('SelectedPersonInfo', { personData })}>
          <View style={styles.calloutContainer}>
            {Platform.OS === 'android' ? (
              senderPicture ? (
                <WebView
                  source={{ html: generateHTMLForImage(senderPicture) }} // Generează HTML pentru imagine
                  style={styles.webViewAndroid} // Stilul pentru WebView
                />
              ) : (
                <Text>No image available</Text> // Fallback dacă imaginea nu este disponibilă
              )
            ) : (
              <Image
                source={{ uri: senderPicture }}
                style={styles.calloutImage}
                resizeMode="cover"
                onLoadStart={() => {
                  setLoading(true)
                }}
                onLoadEnd={() => {
                  setLoading(false)
                }}
              />
            )}
            {loading && (
              <Skeleton
                animation="wave"
                style={[
                  styles.calloutImage,
                  { position: 'absolute', zIndex: 1 },
                ]}
              />
            )}
            <Text style={styles.calloutTitle}>
              Te-ai conectat cu: {senderName}
            </Text>
            <Text style={styles.calloutTitle}>Status:{status}</Text>
          </View>
        </TouchableOpacity>
      </Callout>
    </Marker>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerText: {
    backgroundColor: '#00B0EF', // The background color for the text
    borderRadius: 7, // This applies the rounded corners
    paddingVertical: 3, // Adjust vertical padding (top and bottom)
    paddingHorizontal: 8, // Adjust horizontal padding (left and right)
    fontSize: 12, // Font size for the text
    fontWeight: '500', // Font weight for the text
    color: 'white', // Text color
    textAlign: 'center', // Align text to center
    overflow: 'hidden', // Ensures that the text doesn't exceed the rounded corners
  },
  iconContainer: {
    position: 'relative', // Allows positioning of the image within this container
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
  },
  webViewAndroid: {
    width: '100%',
    height: 150,
    //borderRadius: 50,
    // top: 10,
  },
  iconImage: {
    position: 'absolute', // Overlay the image on the icon
    width: 43, // Width of the image (adjust as needed)
    height: 43, // Height of the image (adjust as needed)
    borderRadius: 50, // Makes the image circular
    top: 10,
  },
  imageAndroid: {
    height: 200,
    width: 330,
  },
  imageWrapperAndroid: {
    height: 200,
    flex: 1,
    marginTop: -85,
    width: 330,
  },
  calloutContainer: {
    width: 200,
    borderRadius: 6,
  },
  calloutImage: {
    width: '100%',
    height: 100,
    borderRadius: 4,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  calloutDescription: {
    fontSize: 12,
  },
})

export default ConnectionMarker
