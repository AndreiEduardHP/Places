import React from 'react'
import { Marker } from 'react-native-maps'
import { MapMarkerProps } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useUser } from '../../Context/AuthContext'
import { t } from 'i18next'

interface SavedMarkerProps extends MapMarkerProps {
  coordinate: {
    latitude: number
    longitude: number
  }
  eventName: string | undefined
  eventDescription: string | undefined
  createdByUserId: number
  onPress?: () => void
}

const SavedMarker: React.FC<SavedMarkerProps> = ({
  coordinate,
  eventName,
  eventDescription,
  createdByUserId,
  onPress,
  ...markerProps
}) => {
  const { loggedUser } = useUser()

  return (
    <Marker
      coordinate={coordinate}
      title={`${t('map.event')}: ${eventName}`}
      description={`${t('map.description')}: ${eventDescription} ${createdByUserId}`}
      onPress={onPress}
      {...markerProps}>
      <Icon
        name="place"
        size={40}
        color={createdByUserId === loggedUser?.id ? 'red' : 'black'}
      />
    </Marker>
  )
}

export default SavedMarker
