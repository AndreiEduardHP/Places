import { t } from 'i18next'
import React from 'react'
import { Marker } from 'react-native-maps'
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
  return (
    <Marker coordinate={coordinate} title={t('map.currentLocation')}>
      <Icon name="place" size={48} color="#00B0EF" />
    </Marker>
  )
}

export default UserLocationMarker
