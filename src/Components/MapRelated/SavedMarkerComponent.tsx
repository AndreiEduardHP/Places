import React from 'react'
import { Marker } from 'react-native-maps'
import { Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useUser } from '../../Context/AuthContext'

interface SavedMarkerProps {
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
}) => {
  const { loggedUser } = useUser()

  return (
    <Marker
      coordinate={coordinate}
      title={`Event: ${eventName}`}
      description={`Description: ${eventDescription} ${createdByUserId}`}
      onPress={onPress}>
      <Icon
        name="place"
        size={40}
        color={createdByUserId === loggedUser?.id ? 'red' : 'black'}
      />
    </Marker>
  )
}

export default SavedMarker
