import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { config } from '../config/urlConfig'
import { ImageConfig } from '../config/imageConfig'
import LoadingComponent from './Loading/Loading'
import { remoteImages } from '../AzureImages/Images'
import { formatDateAndTime } from '../Utils.tsx/Services/FormatDate'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'

type Event = {
  id: number
  eventName: string
  eventDescription: string
  eventImage: string
  eventTime: string
}
const Item: React.FC<Event> = ({
  eventName,
  eventDescription,
  eventImage,
  eventTime,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()

  // Function to toggle the isExpanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  const styles = StyleSheet.create({
    title: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
      paddingLeft: 10,
      color: 'white',
      letterSpacing: -0.6,
      fontWeight: '400',
      ...Platform.select({
        ios: {
          textShadowColor: 'black',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    item: {
      padding: 5,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 50,
      width: 90,
      height: 90,

      borderColor: 'rgba(0,0,0,0.5)',
      borderWidth: 1,
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0, 0, 0, 1)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
        },
        android: {
          elevation: 10,
        },
      }),
    },
    itemBackground: {
      //overflow: 'hidden',
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    userName: {
      fontSize: 26,
      marginLeft: 10,
      color: textColor,
    },
    description: {
      fontSize: 18,
      marginTop: 5,
      padding: 10,

      color: textColor,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    stats: {
      fontSize: 14,
    },
    connect: {
      fontSize: 14,
      alignSelf: 'flex-end',
      marginTop: 10,
      borderWidth: 2,
      borderRadius: 10,
      padding: 5,
    },
  })
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.21)', 'rgba(2, 2, 2, 0.30)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.9 }}
      style={{
        marginTop: 5,
        marginHorizontal: 16,
        borderRadius: 10,
        borderColor:
          textColor === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        borderWidth: 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={
            eventImage && eventImage !== ''
              ? { uri: ImageConfig.IMAGE_CONFIG + eventImage }
              : { uri: remoteImages.partyImage }
          }
          style={styles.item}></Image>
        <View
          style={{
            width: 210,
          }}>
          <Text style={styles.userName}>{eventName}</Text>
        </View>
        <TouchableOpacity onPress={toggleExpand}>
          <Icon
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={45}
            color={textColor === 'white' ? 'white' : 'black'}></Icon>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View>
          <Text style={styles.description}>
            Description: {eventDescription}
          </Text>
          <Text style={styles.description}>
            Date and Time: {formatDateAndTime(new Date(eventTime))}
          </Text>
        </View>
      )}
    </LinearGradient>
  )
}

const EventsAroundYou: React.FC = () => {
  const [eventData, setEventData] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { textColor } = useThemeColor()

  useEffect(() => {
    fetchEvents()
  }, [])
  useEffect(() => {}, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/Event`)
      setEventData(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderItem = ({ item }: { item: Event }) => (
    <Item
      eventName={item.eventDescription}
      eventDescription={item.eventDescription}
      eventImage={item.eventImage}
      id={item.id}
      eventTime={item.eventTime}
    />
  )
  if (isLoading) {
    return <LoadingComponent />
  }
  const styles = StyleSheet.create({
    title: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
      paddingLeft: 10,
      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
  })
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Events around you</Text>
      <FlatList
        data={eventData}
        windowSize={4}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={false}
      />
    </View>
  )
}

export default EventsAroundYou
