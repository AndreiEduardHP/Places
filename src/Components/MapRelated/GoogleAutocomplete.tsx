import axios from 'axios'
import { t } from 'i18next'
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Keyboard, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { map } from '../../config/mapConfig'

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

const GooglePlacesInput: React.ForwardRefRenderFunction<
  any,
  GooglePlacesInputProps
> = (
  {
    onLocationSelected,
    onInputChange,
    userCurrentLatitude,
    userCurrentLongitude,
  },
  ref,
) => {
  const [countryCode, setCountryCode] = useState<string>('')
  const inputRef = useRef<any>(null)

  useEffect(() => {
    const getCountryCode = async () => {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userCurrentLatitude},${userCurrentLongitude}&key=${map.key}`

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

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    },
  }))

  return (
    <View style={{ flex: -221, zIndex: 20 }}>
      <GooglePlacesAutocomplete
        ref={inputRef}
        placeholder={t('labels.addEventLocation')}
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
          key: map.key,
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

export default forwardRef(GooglePlacesInput)
