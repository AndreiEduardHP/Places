import axios from 'axios'
import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { config } from '../config/urlConfig'
import { useNotification } from './Notification/NotificationProvider'
import { Overlay } from '@rneui/base'
import { Button } from 'native-base'
import { t } from 'i18next'

type Props = {
  onSubmit: (ticket: {
    title: string
    description: string
    rating: number
  }) => void
}

const SupportTicket: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [rating, setFeedback] = useState<number>(0)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { showNotificationMessage } = useNotification()

  const handleSubmit = async () => {
    if (title && description && rating) {
      try {
        await axios.post(`${config.BASE_URL}/api/feedback`, {
          title,
          description,
          rating,
        })

        setTitle('')
        setDescription('')
        setFeedback(0)
        setModalVisible(false)
        showNotificationMessage(
          'Feedback sent succesfully, thank you!',
          'success',
        )
      } catch (error) {
        showNotificationMessage(
          'Something went wrong, please try again!',
          'fail',
        )
      }
    }
  }
  const handleFeedback = (rating: number) => {
    setFeedback(rating)
  }

  return (
    <View style={styles.centeredView}>
      <Button onPress={() => setModalVisible(true)} style={styles.ticket}>
        <Text style={styles.ticketText}>
          {t('supportTicket.openTicketForm')}
        </Text>
      </Button>

      <Overlay
        animationType="slide"
        transparent={true}
        isVisible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
        overlayStyle={{ backgroundColor: 'transparent' }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>{t('supportTicket.title')}</Text>
            <TextInput
              style={styles.input}
              onChangeText={setTitle}
              placeholder="Enter the title"
              placeholderTextColor="#888"
            />
            <Text style={styles.label}>{t('supportTicket.description')}</Text>
            <TextInput
              style={styles.input}
              onChangeText={setDescription}
              placeholder="Describe your issue or question"
              placeholderTextColor="#888"
            />
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={styles.label}>{t('supportTicket.feedBack')}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleFeedback(star)}>
                    <Text
                      style={
                        star <= rating ? styles.selectedStar : styles.star
                      }>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View
              style={{
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <Button
                style={[styles.buttonClose]}
                onPress={() => handleSubmit()}>
                <Text style={styles.textStyle}>{t('buttons.submit')}</Text>
              </Button>
              <Button
                style={[styles.buttonClose, { marginTop: 10 }]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>{t('buttons.close')}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Overlay>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  ticketText: {
    color: 'white',
    fontWeight: '400',
  },
  ticket: {
    backgroundColor: 'black',
    padding: 10,
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 25,
    color: '#888',
    marginRight: 5,
  },
  selectedStar: {
    fontSize: 25,
    color: '#f1c40f',
    marginRight: 5,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button: {
    borderRadius: 15,
    padding: 7,
    width: 80,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: '400',
  },
  label: {
    marginVertical: 8,
    fontSize: 26,
    fontWeight: '300',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 7,

    width: 300,
  },
})

export default SupportTicket
