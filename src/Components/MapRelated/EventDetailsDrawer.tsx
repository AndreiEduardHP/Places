// EventDetails.js
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native'
import Checkbox from 'expo-checkbox'
import ParticipantsListContainer from '../EventParticipants'
import { ImageConfig } from '../../config/imageConfig'
import { remoteImages } from '../../AzureImages/Images'
import { MapMarkerDetail } from '../../Interfaces/IUserData'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useUser } from '../../Context/AuthContext'
import EditForm from '../EventForm'
import EditEventForm from '../EditEventForm'
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import { config } from '../../config/urlConfig'

interface EventDetailsProps {
  selectedMarker: {
    eventName?: string
    eventDescription?: string
    eventImage?: string
    key?: string
    maxParticipants: number | undefined
  } | null

  createdByUserId: number | undefined
  drawerVisible: boolean
  isChecked: boolean
  setChecked: (value: boolean) => void
  userHasJoined: boolean
  handleUnJoinEvent: () => void
  handleJoinEvent: () => void
  routeDistance: number | null
  routeDuration: number | null
  openGoogleMaps: () => void
  markers: MapMarkerDetail[]
  refreshParticipantsTrigger: boolean
}

const EventDetails: React.FC<EventDetailsProps> = ({
  selectedMarker,
  drawerVisible,
  createdByUserId,
  isChecked,
  setChecked,
  userHasJoined,

  handleUnJoinEvent,
  handleJoinEvent,
  routeDistance,
  routeDuration,
  openGoogleMaps,
  markers,
  refreshParticipantsTrigger,
}) => {
  const [participantsCount, setParticipantsCount] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { loggedUser } = useUser()

  const handleOpenModal = () => {
    setIsModalVisible(true)
  }

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  return (
    <View
      style={{
        borderTopColor: 'rgba(0,0,0,0.6)',
        borderTopWidth: 1,
        borderRadius: 5,
      }}>
      <View>
        <View style={{}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{ width: '100%' }}>
              <View
                style={{
                  flexDirection: 'row',

                  justifyContent: 'space-between',
                }}>
                <View style={{}}>
                  <Text style={[styles.title, { marginLeft: 5 }]}>
                    Event Name: {selectedMarker?.eventName}
                  </Text>
                </View>

                {createdByUserId === loggedUser?.id && (
                  <View style={{ paddingTop: 3, marginRight: 10 }}>
                    <TouchableOpacity onPress={handleOpenModal}>
                      <MaterialIcons name="edit" size={28} color="black" />
                    </TouchableOpacity>
                  </View>
                )}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalVisible}
                  onRequestClose={() => {
                    setIsModalVisible(!isModalVisible)
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View style={styles.modalHeader}>
                        <Text
                          style={{
                            paddingTop: 4,
                            paddingLeft: 37,
                            fontSize: 24,
                            width: '100%',
                          }}>
                          Edit event Details
                        </Text>
                        <TouchableOpacity
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => {
                            setIsModalVisible(!isModalVisible)
                          }}>
                          <Icon name="close" size={26} color="white" />
                        </TouchableOpacity>
                      </View>
                      <ScrollView
                        style={{
                          borderTopColor: 'black',
                          borderTopWidth: 1,
                          width: '100%',
                        }}>
                        <EditEventForm
                          eventId={selectedMarker?.key}
                          eventName={selectedMarker?.eventName}
                          eventDescription={selectedMarker?.eventDescription}
                          maxParticipants={
                            selectedMarker?.maxParticipants
                          }></EditEventForm>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',

                    marginHorizontal: 20,
                  }}>
                  Max Participants: {selectedMarker?.maxParticipants}
                </Text>
              </View>
            </View>
          </View>

          {selectedMarker && (
            <ParticipantsListContainer
              eventId={Number(selectedMarker?.key)}
              shouldRefreshParticipants={refreshParticipantsTrigger}
              updateParticipantsCount={setParticipantsCount}
            />
          )}
        </View>

        <View style={{ flexDirection: 'row-reverse', margin: 5 }}>
          <Image
            style={{ width: 28, height: 28, marginLeft: 10 }}
            source={require('../../../assets/Icons/quote (1).png')}
          />
          <Text style={styles.eventDescription}>
            {selectedMarker?.eventDescription}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          marginHorizontal: 5,
        }}>
        {drawerVisible && (
          <Image
            style={styles.eventImage}
            source={
              selectedMarker && selectedMarker.eventImage
                ? {
                    uri: ImageConfig.IMAGE_CONFIG + selectedMarker.eventImage,
                  }
                : { uri: remoteImages.partyImage }
            }
          />
        )}
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {!userHasJoined && (
          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={(newValue) => {
                setChecked(newValue)
              }}
              color={isChecked ? '#4630EB' : undefined}
            />

            <Text style={styles.paragraph}>
              Do not show me in the participants list
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={userHasJoined ? handleUnJoinEvent : handleJoinEvent}
          disabled={
            !userHasJoined &&
            participantsCount === (selectedMarker?.maxParticipants || Infinity)
          }>
          <Text style={styles.joinEvent}>
            {
              !userHasJoined &&
              participantsCount >= (selectedMarker?.maxParticipants || Infinity)
                ? 'Limit Reached'
                : userHasJoined
                  ? 'Unjoin Event'
                  : 'Join Event' // Shows based on the user's
            }
          </Text>
        </TouchableOpacity>
      </View>
      {selectedMarker && routeDistance && routeDuration && (
        <View
          style={{
            borderTopColor: 'rgba(0,0,0,0.6)',
            borderTopWidth: 1,
            borderRadius: 5,
          }}>
          <View style={styles.traficInfoContainer}>
            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>
                  Route Distance:
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                  }}>
                  {' '}
                  {routeDistance.toFixed(2)} km
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>
                  Estimated Time With Car:
                </Text>
                <Text style={{ fontSize: 17 }}>
                  {' '}
                  {routeDuration.toFixed(1)} min
                </Text>
              </View>
            </View>

            {markers && (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={[styles.closeTraficInfo, { marginLeft: 20 }]}
                  onPress={openGoogleMaps}>
                  <Text>Open in Google Maps</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    marginBottom: 5,
    width: '100%',
    flexDirection: 'row',

    justifyContent: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
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
    borderRadius: 50,
    padding: 5,

    width: 36,
  },
  buttonClose: {
    backgroundColor: 'black',
  },

  modalText: {
    marginTop: 15,
    textAlign: 'center',
  },
  traficInfoContainer: {
    alignItems: 'center',
    padding: 10,

    marginHorizontal: 5,
    marginBottom: 5,
  },
  closeTraficInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: 150,
    height: 35,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
  },
  eventDescription: {
    fontSize: 16,
    paddingLeft: 2,
    paddingRight: 10,
    paddingTop: 5,
    marginRight: 10,
  },
  eventImage: {
    width: '100%',
    height: 190,
    borderRadius: 25,
  },
  joinEvent: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingTop: 10,
  },
  paragraph: {
    fontSize: 15,
    marginTop: 10,
  },
  checkbox: {
    marginHorizontal: 5,
    paddingTop: 10,
    marginTop: 10,
  },
})

export default EventDetails
