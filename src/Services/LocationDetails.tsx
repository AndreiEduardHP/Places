import axios from 'axios'

export const fetchLocationDetails = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAjpd8EvSYVtI-6tta5IXQYaIJp5PdCS8I`,
    )

    if (response.data.results.length > 0) {
      const formattedAddress = response.data.results[0].formatted_address
      return formattedAddress
    } else {
      return 'Location details not found'
    }
  } catch (error) {
    console.error('Error fetching location details:', error)
    return 'Error fetching location details'
  }
}
