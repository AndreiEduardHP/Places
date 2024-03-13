import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

interface Location {
  latitude: number
  longitude: number
  title?: string // Optional, depending on whether you want to store a title for the marker
}
interface GooglePlacesInputProps {
  onLocationSelected: (location: Location) => void
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  onLocationSelected,
}) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search location"
      onPress={(data, details = null) => {
        if (details) {
          onLocationSelected({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            title: data.structured_formatting.main_text,
          })
        }
      }}
      query={{
        key: 'AIzaSyAjpd8EvSYVtI-6tta5IXQYaIJp5PdCS8I',
        language: 'en',
      }}
      fetchDetails={true}
      styles={{
        textInputContainer: {
          height: 32,
        },
        textInput: {
          height: 32,
          fontSize: 16,
        },

        listView: {},
        row: {},
      }}
    />
  )
}

export default GooglePlacesInput
