import axios from 'axios'
import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { config } from '../config/urlConfig'
import { useNotification } from './Notification/NotificationProvider'

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
        // Make HTTP POST request to your backend server
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
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.ticket}>
        <Text style={styles.ticketText}>Open Ticket Form</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              onChangeText={setTitle}
              placeholder="Enter the title"
              placeholderTextColor="#888"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              onChangeText={setDescription}
              placeholder="Describe your issue or question"
              placeholderTextColor="#888"
            />
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={styles.label}>Feedback</Text>
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
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => handleSubmit()}>
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderRadius: 20,
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
    color: '#f1c40f', // yellow color for selected stars
    marginRight: 5,
  },
  modalView: {
    margin: '30%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    // textAlign: 'center',
  },
  label: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 7,

    width: 250,
  },
})

export default SupportTicket
