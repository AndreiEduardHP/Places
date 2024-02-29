import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native'
import axios from 'axios'
import { config } from '../config/urlConfig'
import ParticipantsList from './ShowEventParticipants'

interface Participant {
  id: string
  firstName: string
  lastName: string
  interest: string
  profilePicture: string
}

interface ParticipantsListContainerProps {
  eventId: number
  shouldRefreshParticipants: boolean
  updateParticipantsCount: (count: number) => void
}

const ParticipantsListContainer: React.FC<ParticipantsListContainerProps> = ({
  eventId,
  shouldRefreshParticipants,
  updateParticipantsCount,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [totalParticipants, setTotalParticipants] = useState<number>(0)
  const [showParticipants, setShowParticipants] = useState<boolean>(false)
  const slideAnimation = useRef(new Animated.Value(0)).current
  const heightAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fetchParticipants()
  }, [eventId, shouldRefreshParticipants])
  useEffect(() => {
    updateParticipantsCount(totalParticipants)
  }, [totalParticipants])

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/userprofileevent/event/${eventId}/userprofiles`,
      )
      if (response) {
        setParticipants(response.data.userProfiles)
        if (response.data.countParticipants)
          setTotalParticipants(response.data.countParticipants)
        else {
          setTotalParticipants(0)
        }
      } else {
        setTotalParticipants(0)
      }
    } catch (error) {
      setTotalParticipants(0)
    }
  }

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants)

    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: showParticipants ? 0 : 1, // 0: hidden, 1: visible
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(heightAnimation, {
        toValue: showParticipants ? 0 : 1, // Adjust the end height as needed
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const animatedStyle = {
    opacity: slideAnimation,
    height: heightAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '45%'], // Adjust based on your content's height
    }),
  }

  return (
    <View>
      <TouchableOpacity onPress={toggleParticipants}>
        <Text style={styles.participants}>
          Total Participants: {totalParticipants}
        </Text>
        <Text style={{ padding: 5 }}>
          Note:some participants might not show up in list based on their
          preference!
        </Text>
      </TouchableOpacity>
      <Animated.View style={[styles.listContainer, animatedStyle]}>
        <ParticipantsList eventId={eventId} participants={participants} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  participants: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 5,
    marginHorizontal: 20,
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
})

export default ParticipantsListContainer
