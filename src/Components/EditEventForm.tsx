import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { remoteImages } from '../AzureImages/Images'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { MapMarkerDetail } from '../Interfaces/IUserData'
import { ScrollView } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import { Button } from 'native-base'
import { Text } from '@rneui/themed'
import ImageModal from '../Modals/ImageModal'
import { t } from 'i18next'
import { BlobServiceClient } from '@azure/storage-blob'
import { azureConfigBlob } from '../config/azureBlobConfig'
import { Skeleton } from '@rneui/base'

interface EditFormProps {
  eventId: any
  otherRelevantInformation?: string
  eventName: string | undefined
  eventDescription: string | undefined
  maxParticipants: number | undefined
  eventImage?: string | undefined
  latitude: any
  longitude: any
  refreshSelectedMarkerData: (updatedEvent: MapMarkerDetail) => void
}

const EditForm: React.FC<EditFormProps> = ({
  eventId,
  eventName,
  otherRelevantInformation,
  refreshSelectedMarkerData,
  maxParticipants,
  eventImage,
  latitude,
  longitude,
  eventDescription,
}) => {
  const [editedEventName, setEditedEventName] = useState(eventName || '')

  const [editedEventDescription, setEditedEventDescription] = useState(
    eventDescription || '',
  )
  const [editedEventRelevantInfo, setEditedEventRelevantInfo] = useState(
    otherRelevantInformation || '',
  )
  const [editedMaxParticipants, setEditedMaxParticipants] = useState(
    maxParticipants ? maxParticipants.toString() : '',
  )
  const [editedEventImage, setEditedEventImage] = useState<any>(
    eventImage ? eventImage : eventImage || '',
  )
  const [editedEventImageSave, setEditedEventImageSave] = useState<any>(
    eventImage || '',
  )
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.1,

      allowsEditing: true,
    })

    if (!result.canceled && result.assets) {
      const image = result.assets[0]
      const blobUrl = await uploadImageToBlob(image.uri)
      setEditedEventImage(blobUrl)
      setEditedEventImageSave(blobUrl)
    } else {
      Alert.alert('Error', 'Image picking was cancelled or failed')
    }
  }

  const uploadImageToBlob = async (imageUri: string) => {
    try {
      const blobServiceClient = new BlobServiceClient(
        `https://${azureConfigBlob.accountName}.blob.core.windows.net?${azureConfigBlob.sasToken}`,
      )

      const containerClient = blobServiceClient.getContainerClient(
        azureConfigBlob.containerName,
      )
      const blobName = `event-${Date.now()}.jpg`
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const response = await fetch(imageUri)
      const blob = await response.blob()

      blockBlobClient.uploadData(blob)

      return blockBlobClient.url
    } catch (error) {
      console.error('Error uploading image to Blob Storage:', error)
    }
  }

  const saveEvent = async () => {
    try {
      const response = await axios.put(
        `${config.BASE_URL}/api/event/updateEvent/${Number(eventId)}`,
        {
          eventName: editedEventName,
          eventImage: editedEventImageSave,
          eventDescription: editedEventDescription,
          maxParticipants: Number(editedMaxParticipants),
          otherRelevantInformation: editedEventRelevantInfo,
        },
      )
      const responseEvent = await axios.get(
        `${config.BASE_URL}/api/event/${Number(eventId)}`,
      )

      // Assuming responseEvent.data directly contains the event object
      const updatedEvent = responseEvent.data
      const newMarker = {
        latitude: latitude,
        longitude: longitude,
        key: eventId,
        eventName: updatedEvent.eventName,
        eventDescription: updatedEvent.eventDescription,
        eventImage: updatedEvent.eventImage,
        maxParticipants: updatedEvent.maxParticipants,
        createdByUserId: updatedEvent.createdByUserId,
        otherRelevantInformation: updatedEvent.otherRelevantInformation,
      }
      refreshSelectedMarkerData(newMarker)
      Alert.alert('Success', 'Event updated successfully')
    } catch (error) {
      // Handle error, maybe show an error message
      Alert.alert('Error', 'Failed to update event')
      console.error('Error updating event:', error)
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            marginTop: 10,
          }}>
          <View>
            <Text style={styles.title}>{t('editEventForm.eventName')}:</Text>
            <TextInput
              defaultValue={editedEventName}
              onChangeText={setEditedEventName}
              placeholder="Event Name"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.title}>
              {t('editEventForm.eventDescription')}:
            </Text>
            <TextInput
              defaultValue={editedEventDescription}
              onChangeText={setEditedEventDescription}
              placeholder="Event Description"
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.title}>
              {t('eventForm.otherRelevantInformation')}:
            </Text>
            <TextInput
              defaultValue={editedEventRelevantInfo}
              onChangeText={setEditedEventRelevantInfo}
              placeholder="Event Relevant Info"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.title}>
              {t('editEventForm.eventMaxParticipants')}:
            </Text>
            <TextInput
              defaultValue={editedMaxParticipants}
              onChangeText={setEditedMaxParticipants}
              placeholder="Max Participants"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
            {!isLoaded && (
              <Skeleton
                animation="wave"
                style={[
                  styles.eventImage,
                  {
                    position: 'absolute',
                    zIndex: 1,
                  },
                ]}
              />
            )}
            <Image
              style={styles.eventImage}
              source={
                editedEventImage
                  ? {
                      uri: editedEventImage,
                    }
                  : { uri: remoteImages.partyImage }
              }
              onLoadStart={() => setIsLoaded(false)}
              onLoadEnd={() => setIsLoaded(true)}
            />
          </TouchableOpacity>

          <ImageModal
            visible={isImageModalVisible}
            imageUrl={editedEventImage}
            onClose={() => setIsImageModalVisible(false)}
          />
          <Button
            style={{
              //backgroundColor: 'black',
              // borderRadius: 10,
              //  width: 300,
              alignItems: 'center',
            }}
            bg="red.500"
            onPress={selectImage}>
            <Text
              style={[
                // styles.title,
                {
                  // padding: 5,
                  color: 'white',
                  fontSize: 18,
                },
              ]}>
              {t('buttons.changeEventImage')}
            </Text>
          </Button>

          <Button
            style={{
              //  backgroundColor: '#00B0FE',
              // borderRadius: 10,
              // width: 300,
              alignItems: 'center',
              marginTop: 10,
            }}
            bg="#00B0FE"
            onPress={saveEvent}>
            <Text
              style={[
                styles.title,
                {
                  //   padding: 5,
                  color: 'white',
                  fontSize: 18,
                },
              ]}>
              {t('buttons.save')}
            </Text>
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    //width: 300,
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
    //  width: 305,
    height: 190,
    borderRadius: 15,
    marginVertical: 10,
  },
})

export default EditForm
