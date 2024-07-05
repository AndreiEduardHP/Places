import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
} from 'react-native'
import axios from 'axios'
import { config } from '../config/urlConfig'
import ParticipantsList from './ShowEventParticipants'
import { useTranslation } from 'react-i18next'

interface Participant {
  id: string
  firstName: string
  lastName: string
  interest: string
  profilePicture: string
}

interface ParticipantsListContainerProps {
  eventId: number
  textColor?: string
  shouldRefreshParticipants: boolean
  updateParticipantsCount: (count: number) => void
}

const ParticipantsListContainer: React.FC<ParticipantsListContainerProps> = ({
  eventId,
  textColor,
  shouldRefreshParticipants,
  updateParticipantsCount,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [totalParticipants, setTotalParticipants] = useState<number>(0)
  const [showParticipants, setShowParticipants] = useState<boolean>(false)
  const slideAnimation = useRef(new Animated.Value(0)).current
  const { t } = useTranslation()

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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    Animated.timing(slideAnimation, {
      toValue: showParticipants ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  const animatedStyle = {
    opacity: slideAnimation,
    height: slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 150],
    }),
  }

  return (
    <View>
      <TouchableOpacity onPress={toggleParticipants}>
        <Text style={[styles.participants, { color: textColor }]}>
          {t('eventParticipants.totalParticipants')}: {totalParticipants}
        </Text>
        <Text style={{ color: textColor, marginBottom: 10 }}>
          {t('eventParticipants.note')}
        </Text>
      </TouchableOpacity>
      {showParticipants && (
        <Animated.View style={[styles.listContainer, animatedStyle]}>
          <ParticipantsList eventId={eventId} participants={participants} />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  participants: {
    fontSize: 16,
    fontWeight: '400',
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
})

export default ParticipantsListContainer
