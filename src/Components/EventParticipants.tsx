import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import axios from 'axios'
import { config } from '../config/urlConfig'
import ParticipantsList from './ShowEventParticipants'
import { Button, Icon, ListItem } from '@rneui/base'
import { t } from 'i18next'
import { useUser } from '../Context/AuthContext'

interface Participant {
  id: string
  firstName: string
  lastName: string
  interest: string
  description: string
  profilePicture: string
  friendRequestStatus: string
}

interface ParticipantsListContainerProps {
  eventId: number
  textColor?: string
  shouldRefreshParticipants: boolean
  updateParticipantsCount: (count: number) => void
  applyMarginHorizontal?: boolean
}

const ParticipantsListContainer: React.FC<ParticipantsListContainerProps> = ({
  eventId,
  textColor,
  shouldRefreshParticipants,
  updateParticipantsCount,
  applyMarginHorizontal = false,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [totalParticipants, setTotalParticipants] = useState<number>(0)
  const [modalVisible, setModalVisible] = useState(false)
  const { loggedUser } = useUser()

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }
  useEffect(() => {
    fetchParticipants()
  }, [eventId, shouldRefreshParticipants])
  useEffect(() => {
    updateParticipantsCount(totalParticipants)
  }, [totalParticipants])

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/userprofileevent/event/${eventId}/userprofiles/${loggedUser?.id}`,
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

  return (
    <View>
      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: applyMarginHorizontal ? 10 : 0,
          }}>
          <Text
            style={{
              color: textColor || 'black',
              marginLeft: 0,
              fontSize: 18,
            }}>
            {t('eventParticipants.totalParticipants')}: {totalParticipants}
          </Text>
          <Icon
            name="keyboard-arrow-right"
            size={26}
            color={textColor || 'black'}
            containerStyle={{ padding: 0, margin: 0 }}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: '97%',
              height: '85%',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 8,
            }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              {t('eventParticipants.totalParticipants')} ({totalParticipants})
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '300', marginBottom: 5 }}>
              {t('eventParticipants.note')}
            </Text>
            <ParticipantsList
              eventId={eventId}
              participants={participants}
              onCloseModal={toggleModal}
            />
            <Button title={t('buttons.close')} onPress={toggleModal} />
          </View>
        </View>
      </Modal>
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
