import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import axios from 'axios'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Card, Title, Paragraph, Button } from 'react-native-paper'
import LineComponent from './LineComponent'
import { Text } from '@rneui/themed'
import { t } from 'i18next'

type EventCardProps = {
  id: number
  name: string
  description: string
  image: string
  time: string
  latitude: number
  longitude: number
  interest: string
  onConnect?: () => void
  isPersonCard?: boolean
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  description,
  image,
  time,
  latitude,
  longitude,
  interest,
  onConnect,
  isPersonCard = false,
}) => {
  const [locationAddress, setLocationAddress] = useState<string>('')
  const navigate = useHandleNavigation()
  const { textColor } = useThemeColor()

  useEffect(() => {
    if (!isPersonCard) {
      const fetchLocation = async () => {
        const address = await fetchLocationDetails(latitude, longitude)
        setLocationAddress(address)
      }

      fetchLocation()
    }
  }, [latitude, longitude, isPersonCard])

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`,
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

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const dayName = days[date.getUTCDay()]
    const day = date.getUTCDate()
    const month = months[date.getUTCMonth()]
    const year = date.getUTCFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${dayName} ${day} ${month} ${year} ${hours}:${minutes}`
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor:
        textColor == 'white' ? 'rgba(48, 51, 55,1)' : 'rgba(122,212,112,1)',
      margin: 10,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    icon: {
      marginRight: 5,
    },
    dateAndTime: {
      fontSize: 16,
      color: textColor,
      marginTop: 5,
    },
    locationAddress: {
      fontSize: 16,
      color: textColor,
      textAlign: 'left',
      paddingRight: 15,
    },
  })

  return (
    <Card style={styles.card}>
      <Card.Cover
        source={
          image ? { uri: image } : require('../../assets/DefaultUserIcon.png')
        }
      />
      <Card.Content>
        <Title style={{ color: textColor }}>
          {isPersonCard ? `Name: ${name}` : `Event name: ${name}`}
        </Title>
        <Paragraph style={{ color: textColor, marginBottom: 10 }}>
          {isPersonCard
            ? `Interests: ${interest}`
            : `Event description: ${description}`}
        </Paragraph>
        {!isPersonCard && <LineComponent />}
        <View style={styles.infoContainer}>
          <MaterialIcons
            name="calendar-month"
            size={26}
            color={textColor}
            style={styles.icon}
          />
          <Text style={styles.dateAndTime}>{formatEventDate(time)}</Text>
        </View>
        {!isPersonCard && (
          <View style={styles.infoContainer}>
            <MaterialIcons
              name="location-on"
              size={26}
              color={textColor}
              style={styles.icon}
            />
            <Text style={styles.locationAddress}>{locationAddress}</Text>
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        {isPersonCard ? (
          <Button
            contentStyle={{ backgroundColor: 'rgba(10,10,10,1)' }}
            onPress={onConnect}>
            {t('peopleCard.connect')}
          </Button>
        ) : (
          <Button
            contentStyle={{ backgroundColor: 'rgba(10,10,10,1)' }}
            onPress={() => navigate('MapScreen', { latitude, longitude })}>
            {t('eventsAroundYou.seeLocationOnMap')}
          </Button>
        )}
      </Card.Actions>
    </Card>
  )
}

export default EventCard
