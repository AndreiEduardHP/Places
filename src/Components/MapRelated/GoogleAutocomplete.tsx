import React from 'react'
import { Keyboard } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

interface Location {
  latitude: number
  longitude: number
  title?: string
}
interface GooglePlacesInputProps {
  onLocationSelected: (location: Location) => void
  onInputChange: (isEmpty: boolean) => void
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  onLocationSelected,
  onInputChange,
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
          onInputChange(true)
        }
      }}
      query={{
        key: 'AIzaSyAjpd8EvSYVtI-6tta5IXQYaIJp5PdCS8I',
        language: 'en',
      }}
      fetchDetails={true}
      textInputProps={{
        onChangeText: (text: string) => {
          if (text === '') {
            Keyboard.dismiss()
            onInputChange(false)
          }
        },
      }}
      styles={{
        textInputContainer: {
          height: 32,
          zIndex: 2,
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
