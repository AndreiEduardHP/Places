import * as Location from 'expo-location'

export const getLocation = async (
  accuracy: string = 'balanced',
): Promise<{
  latitude: number
  longitude: number
} | null> => {
  try {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.error('Permission to access location was denied')
      return null
    }

    // Define the variable outside the if-else blocks
    let location

    // Check accuracy and fetch location accordingly
    if (accuracy === 'lowest') {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      })
    } else {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
    }

    // Return location coordinates if available
    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting current location:', error)
    return null
  }
}
