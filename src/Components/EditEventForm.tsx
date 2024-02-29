import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native'
import { ImageConfig } from '../config/imageConfig'
import { remoteImages } from '../AzureImages/Images'
import axios from 'axios'
import { config } from '../config/urlConfig'

interface EditFormProps {
  eventId: string | undefined
  eventName: string | undefined
  eventDescription: string | undefined
  maxParticipants: number | undefined
  eventImage?: string | undefined
}

const EditForm: React.FC<EditFormProps> = ({
  eventId,
  eventName,
  maxParticipants,
  eventImage,
  eventDescription,
}) => {
  const [editedEventName, setEditedEventName] = useState(eventName || '')
  const [editedEventDescription, setEditedEventDescription] = useState(
    eventDescription || '',
  )
  const [editedMaxParticipants, setEditedMaxParticipants] = useState(
    maxParticipants ? maxParticipants.toString() : '',
  )

  const saveEvent = async () => {
    try {
      const response = await axios.put(
        `${config.BASE_URL}/api/event/updateEvent/${Number(eventId)}`,
        {
          eventName: editedEventName,
          eventDescription: editedEventDescription,
          // maxParticipants: Number(editedMaxParticipants),
          // Other fields you want to update
        },
      )

      Alert.alert('Success', 'Event updated successfully')
    } catch (error) {
      // Handle error, maybe show an error message
      Alert.alert('Error', 'Failed to update event')
      console.error('Error updating event:', error)
    }
  }
  return (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <TextInput
        defaultValue={eventId || ''}
        editable={false} // Prevent editing of eventId
      />
      <View>
        <Text style={styles.title}>Event name:</Text>
        <TextInput
          defaultValue={editedEventName}
          onChangeText={setEditedEventName}
          placeholder="Event Name"
          style={styles.input}
        />
      </View>

      <View>
        <Text style={styles.title}>Event description:</Text>
        <TextInput
          defaultValue={editedEventDescription}
          onChangeText={setEditedEventDescription}
          placeholder="Event Description"
          style={styles.input}
        />
      </View>

      <View>
        <Text style={styles.title}>Max Participants:</Text>
        <TextInput
          defaultValue={editedMaxParticipants}
          onChangeText={setEditedMaxParticipants}
          placeholder="Max Participants"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <Image
        style={styles.eventImage}
        source={
          eventImage
            ? {
                uri: ImageConfig.IMAGE_CONFIG + eventImage,
              }
            : { uri: remoteImages.partyImage }
        }
      />

      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          borderRadius: 10,
          width: 100,
          alignItems: 'center',
        }}
        onPress={saveEvent}>
        <Text
          style={[
            styles.title,
            {
              padding: 7,
              color: 'white',
              fontSize: 18,
            },
          ]}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 40,
    margin: 7,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventImage: {
    width: 305,
    height: 150,
    borderRadius: 25,
    marginVertical: 10,
  },
})

export default EditForm