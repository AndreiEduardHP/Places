import { t } from 'i18next'
import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Callout, Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface UserLocationMarkerProps {
  coordinate: {
    latitude: number
    longitude: number
  }
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  coordinate,
}) => {
  const markerRef = useRef<any | null>(null) // Properly typing the ref to `Marker`

  // Show Callout automatically when the marker is mounted
  useEffect(() => {
    const showMarkerCallout = () => {
      if (markerRef.current) {
        markerRef.current.showCallout() // Ensure markerRef is defined
      }
    }

    // Adding a timeout to ensure the marker is fully mounted
    const timeoutId = setTimeout(showMarkerCallout, 500)

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <Marker
      coordinate={coordinate}
      title={t('map.currentLocation')}
      ref={markerRef}>
      <Icon name="place" size={48} color="#00B0EF" />
      <Callout tooltip={Platform.OS === 'android'}>
        <View style={styles.calloutContainer}>
          <View style={styles.calloutContent}>
            <Text style={styles.calloutTitle}>{t('map.currentLocation')}</Text>
          </View>
        </View>
      </Callout>
    </Marker>
  )
}

const styles = StyleSheet.create({
  calloutContainer: {
    borderRadius: 6,
    width: 110,
  },
  calloutContent: {},
  calloutTitle: {
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default UserLocationMarker
