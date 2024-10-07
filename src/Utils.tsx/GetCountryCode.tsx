import axios from 'axios'
import * as Location from 'expo-location'
import { map } from '../config/mapConfig'

const getCountryCode = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.error('Permission to access location was denied')
      return
    }

    let location = await await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${map.key}`
    try {
      const response = await axios.get(geocodeUrl)
      const results = response.data.results
      if (results.length > 0) {
        const addressComponents = results[0].address_components
        const countryComponent = addressComponents.find((component: any) =>
          component.types.includes('country'),
        )
        if (countryComponent) {
          return countryComponent.short_name.toLowerCase()
        }
      }
    } catch (error) {
      console.error('Error fetching country code:', error)
      return ''
    }
  } catch (error) {
    console.error('Error getting current location:', error)
  }
}

export default getCountryCode
