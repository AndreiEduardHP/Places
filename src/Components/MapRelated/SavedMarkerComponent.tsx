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
import WebView from 'react-native-webview'
interface SavedMarkerProps extends MapMarkerProps {
  coordinate: {
    latitude: number
    longitude: number
  }
  eventName: string | undefined
  eventDescription: string | undefined
  createdByUserId: number
  eventImage: string | undefined
  onPress?: () => void
  onPressCallOut?: () => void
  deselectRoute?: () => void
  showCallout?: boolean
}

const SavedMarker: React.FC<SavedMarkerProps> = ({
  coordinate,
  eventName,
  eventDescription,
  createdByUserId,
  eventImage,
  onPress,
  onPressCallOut,
  deselectRoute,
  showCallout,
  ...markerProps
}) => {
  const { loggedUser } = useUser()
  const [loading, setLoading] = useState(true)
  const [loadingMarkersImages, setLoadingMarkersImages] = useState(true)
  const markerRef = useRef<any>()

  useEffect(() => {
    if (markerRef.current) {
      if (showCallout) {
        // Hide the callout first before showing it
        markerRef.current.hideCallout()
        setTimeout(() => {
          markerRef.current.showCallout()
        }, 100) // Small delay to ensure it's triggered correctly
      }
    }
  }, [showCallout])
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
      coordinate={coordinate}
      title={`${t('map.event')}: ${eventName}`}
      description={`${t('map.description')}: ${eventDescription} ${createdByUserId}`}
      onPress={onPress}
      onCalloutPress={() => {
        if (Platform.OS === 'android') {
          // Only execute on Android
          if (onPressCallOut) onPressCallOut()
        }
      }}
      {...markerProps}>
      <View style={styles.markerContainer}>
        <Text style={styles.markerText}>{eventName}</Text>
        <View style={styles.iconContainer}>
          {/* The background icon */}
          <Icon
            name="place"
            size={100}
            color={
              createdByUserId === loggedUser?.id
                ? 'rgba(123,131,223,1)'
                : 'rgba(23,231,123,1)'
            }
          />

          {/* The image in the center of the icon */}
          <Image
            source={{ uri: eventImage }} // Replace this with the image URI you want to display
            style={styles.iconImage}
            onLoadStart={() => {
              setLoadingMarkersImages(true)
            }}
            onLoadEnd={() => {
              setLoadingMarkersImages(false)
            }}
          />
          {loadingMarkersImages && (
            <Skeleton
              animation="wave"
              style={[styles.iconImage, { position: 'absolute', zIndex: 1 }]}
            />
          )}
        </View>
      </View>

      <Callout>
        <View style={styles.calloutContainer}>
          {/* Iconița de close */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                if (markerRef.current) {
                  markerRef.current.hideCallout() // Ascunde Callout-ul
                  if (deselectRoute) deselectRoute()
                }
              }}>
              <Icon name="close" size={28} color={'black'} />
            </TouchableOpacity>
          )}

          {/* Conținutul callout-ului */}
          <TouchableOpacity
            onPress={() => {
              if (onPressCallOut) onPressCallOut() // Asigură-te că funcția este apelată corect
            }}>
            <View style={styles.calloutContent}>
              {Platform.OS === 'android' ? (
                eventImage ? (
                  <WebView
                    source={{ html: generateHTMLForImage(eventImage) }} // Generează HTML pentru imagine
                    style={styles.webViewAndroid} // Stilul pentru WebView
                    onLoadStart={() => setLoadingMarkersImages(true)}
                    onLoadEnd={() => setLoadingMarkersImages(false)}
                  />
                ) : (
                  <Text>No image available</Text> // Fallback dacă imaginea nu este disponibilă
                )
              ) : (
                <Image
                  source={{ uri: eventImage }} // Asum că ai o cale URL pentru imagine
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
              {loading && Platform.OS === 'ios' && (
                <Skeleton
                  animation="wave"
                  style={[
                    styles.calloutImage,
                    { position: 'absolute', zIndex: 1 },
                  ]}
                />
              )}
              <Text style={styles.calloutTitle}>{eventName}</Text>
              <Text
                style={
                  styles.calloutDescription
                }>{`Description: ${eventDescription}`}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  )
}
const styles = StyleSheet.create({
  calloutView: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: 'red',
  },
  imageAndroid: {
    height: 200,
    width: 330,
  },
  imageIOS: {
    height: '50%',
    width: '100%',
  },
  webViewAndroid: {
    width: '100%',
    height: 150,

    top: 5,
  },
  imageWrapperAndroid: {
    height: 10,
    //flex: 1,
    //marginTop: -85,
    width: 10,
  },
  calloutContainer: {
    width: 200, // Poți ajusta lățimea după necesități
  },

  iconImage: {
    position: 'absolute', // Overlay the image on the icon
    width: 55, // Width of the image (adjust as needed)
    height: 55, // Height of the image (adjust as needed)
    borderRadius: 50, // Makes the image circular
    top: 10,
  },
  iconContainer: {
    position: 'relative', // Allows positioning of the image within this container

    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
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
  markerContainer: {
    alignItems: 'center', // Centers the text and icon
  },
  calloutContent: {},

  closeButton: {
    position: 'absolute', // Poziționează iconița absolut
    right: '-4%', // În partea dreaptă cu o margine de 10
    top: '-4%', // Poziționează iconița la 10px de sus
    zIndex: 2, // Asigură-te că iconița este deasupra altor elemente
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  calloutImage: {
    ...Platform.select({
      android: {
        width: '100%',
        height: '100%',
      },
      ios: { width: '100%', height: 150 },
    }),
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  calloutDescription: {
    fontSize: 12,
  },
  calloutCoordinates: {
    fontSize: 10,
    color: 'grey',
  },
  calloutTouchable: {
    width: '100%', // Asigură că touchable ocupă tot spațiul callout-ului
  },
})

export default SavedMarker
