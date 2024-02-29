import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  ImageBackground,
} from 'react-native'
import { config } from '../config/urlConfig'
import { ImageConfig } from '../config/imageConfig'
import LoadingComponent from './Loading/Loading'
import { remoteImages } from '../AzureImages/Images'

type Event = {
  id: number
  eventName: string
  eventDescription: string
  eventImage: string
  eventTime: string
}
const Item: React.FC<Event> = ({ eventName, eventDescription, eventImage }) => (
  <ImageBackground
    source={
      eventImage && eventImage !== ''
        ? { uri: ImageConfig.IMAGE_CONFIG + eventImage }
        : { uri: remoteImages.partyImage }
    }
    style={styles.item}
    imageStyle={{ borderRadius: 6 }}>
    <View
      style={{
        paddingLeft: 10,

        width: 210,
      }}>
      <Text style={styles.userName}>{eventName}</Text>
      <Text style={styles.description}>{eventDescription}</Text>
      <View style={styles.statsContainer}></View>
    </View>
  </ImageBackground>
)

const EventsAroundYou: React.FC = () => {
  const [eventData, setEventData] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
    console.log(eventData)
  }, [])
  useEffect(() => {
    console.log(eventData)
  }, [])

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
  return (
    <FlatList
      data={eventData}
      windowSize={4}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal={true}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    //backgroundColor: 'grey',
    opacity: 0.98,
    padding: 5,
    marginVertical: 8,
    marginLeft: 16,
    borderRadius: 6,
    width: 300,

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
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    marginTop: 5,

    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
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

export default EventsAroundYou
