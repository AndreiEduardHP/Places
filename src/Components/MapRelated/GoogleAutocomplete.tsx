import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Keyboard, SafeAreaView, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

interface Location {
  latitude: number
  longitude: number
  title?: string
}
interface GooglePlacesInputProps {
  onLocationSelected: (location: Location) => void
  onInputChange: (isEmpty: boolean) => void
  userCurrentLatitude: number
  userCurrentLongitude: number
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  onLocationSelected,
  onInputChange,
  userCurrentLatitude,
  userCurrentLongitude,
}) => {
  const [countryCode, setCountryCode] = useState<string>('')

  useEffect(() => {
    const getCountryCode = async () => {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userCurrentLatitude},${userCurrentLongitude}&key=AIzaSyAjpd8EvSYVtI-6tta5IXQYaIJp5PdCS8I`

      try {
        const response = await axios.get(geocodeUrl)
        const results = response.data.results
        if (results.length > 0) {
          const addressComponents = results[0].address_components
          const countryComponent = addressComponents.find((component: any) =>
            component.types.includes('country'),
          )
          if (countryComponent) {
            setCountryCode(countryComponent.short_name.toLowerCase())
          }
        }
      } catch (error) {
        console.error('Error fetching country code:', error)
      }
    }

    getCountryCode()
  }, [])

  return (
    <View style={{ flex: -221, zIndex: 20 }}>
      <GooglePlacesAutocomplete
        placeholder="Search location"
        onPress={(data, details = null) => {
          2
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
          components: countryCode ? `country:${countryCode}` : '',
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
        listViewDisplayed="auto"
      />
    </View>
  )
}

export default GooglePlacesInput
