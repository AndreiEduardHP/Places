import React from 'react'
import { Marker } from 'react-native-maps'
import { Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface SavedMarkerProps {
  coordinate: {
    latitude: number
    longitude: number
  }
  eventName: string | undefined
  eventDescription: string | undefined

  onPress?: () => void
}

const SavedMarker: React.FC<SavedMarkerProps> = ({
  coordinate,
  eventName,
  eventDescription,

  onPress,
}) => {
  return (
    <Marker
      coordinate={coordinate}
      title={`Event: ${eventName}`}
      description={`Description: ${eventDescription}`}
      onPress={onPress}>
      <Icon name="place" size={40} color="#000" />
    </Marker>
  )
}

export default SavedMarker
