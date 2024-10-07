import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native'
import ParticipantsListContainer from '../EventParticipants'
import { remoteImages } from '../../AzureImages/Images'
import { MapMarkerDetail } from '../../Interfaces/IUserData'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useUser } from '../../Context/AuthContext'
import EditEventForm from '../EditEventForm'
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import { CheckBox, Skeleton } from '@rneui/base'
import { Button } from 'native-base'
import { Text } from '@rneui/themed'
import ImageModal from '../../Modals/ImageModal'
import { t } from 'i18next'
import { Title } from 'react-native-paper'
import StepperHorizontal from '../../Screens/Stepper'
import Stepper from 'react-native-stepper-ui'
import TermsAndConditions from '../TermsAndConditions'
import ImageCarousel from '../ImageCarousel/ImageCarousel'

interface EventDetailsProps {
  selectedMarker: {
    otherRelevantInformation?: string
    eventName?: string
    eventDescription?: string
    eventImage?: string
    latitude: number
    longitude: number
    imageAlbumUrls?: string[]
    key?: string
    maxParticipants: number | undefined
  } | null
  refreshSelectedMarkerData: (updatedEvent: MapMarkerDetail) => void
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
  refreshSelectedMarkerData,
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
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false)
  const { loggedUser } = useUser()
  const [qrCode, setQrCode] = useState('')

  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [active, setActive] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [seeAlbum, setSeeAlbum] = useState(false)

  const handleAcceptanceToggle = () => {
    setTermsAccepted(!termsAccepted)
  }
  const handleNext = () => {
    if (active === 0 && !termsAccepted) {
      Alert.alert(
        'Terms and Conditions',
        'You must accept the terms and conditions to proceed.',
      )
    } else {
      setActive(active + 1)
    }
  }
  const handleOpenModal = () => {
    setIsModalVisible(true)
  }

  const handleOpenConfirmationModal = () => {
    setIsConfirmationModalVisible(true)
  }

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalVisible(false)
  }
  const handleConfirmJoinUnjoin = () => {
    if (userHasJoined) {
      handleUnJoinEvent()
      setActive(0)
    } else {
      handleJoinEvent()
      setActive(0)
    }
    handleCloseConfirmationModal()
  }
  const styles = StyleSheet.create({
    modalHeader: {
      marginBottom: 5,
      width: '100%',
      flexDirection: 'row',

      justifyContent: 'flex-end',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 50,
    },
    confirmButton: {
      width: 100,
      backgroundColor: '#00B0EF',
      padding: 10,
      borderRadius: 5,
    },
    cancelButton: {
      width: 100,
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
    },
    tableContainer: {
      flexDirection: 'column',
      padding: 11,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 3,
    },
    tableCellHeader: {
      fontSize: 17,
      fontWeight: '500',
    },
    tableCell: {
      fontSize: 17,
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
      //  shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      //elevation: 5,
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
      //  padding: 10,

      marginHorizontal: 10,
      // marginBottom: 5,
    },
    closeTraficInfo: {
      alignItems: 'center',

      justifyContent: 'center',
      // marginTop: 5,
      //  width: 170,
      // height: 35,
      //  borderRadius: 10,
      // borderColor: 'black',
      // borderWidth: 1,
    },
    title: {
      fontSize: 18,
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
      //  fontSize: 18,
      color: 'white',
      // marginTop: 10,
      // marginBottom: 10,
      //  borderWidth: 1,
      //  borderRadius: 10,
      //  padding: 5,
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      // paddingTop: 1,
    },
    paragraph: {
      fontSize: 15,
      marginTop: 0,
    },
    checkbox: {
      marginHorizontal: 2,

      // marginTop: 2,
    },
  })
  const content = [
    <View
      style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
      <TermsAndConditions
        accepted={termsAccepted}
        onToggle={handleAcceptanceToggle}
      />
    </View>,

    <View style={styles.modalView}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: '300',
        }}>
        {userHasJoined
          ? t('map.confirmUnjoinEvent')
          : t('map.confirmJoinEvent')}
      </Text>

      <View style={styles.modalButtonContainer}>
        <Button style={styles.confirmButton} onPress={handleConfirmJoinUnjoin}>
          <Text style={{ color: 'white' }}>{t('map.yes')}</Text>
        </Button>
        <Button
          style={styles.cancelButton}
          onPress={handleCloseConfirmationModal}>
          <Text style={{ color: 'white' }}>{t('map.no')}</Text>
        </Button>
      </View>
    </View>,
  ]

  const fetchQRCode = async (
    eventId: string | undefined,
    userId: number | undefined,
  ) => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/userprofileevent/GetQRCode/${selectedMarker?.key}/${loggedUser?.id}`,
      )
      if (response.status === 200 && response.data) {
        setQrCode(response.data.qrCode)
      } else {
        setQrCode('')
      }
    } catch (error) {
      setQrCode('')
    }
  }

  useEffect(() => {
    const loadQRCode = async () => {
      if (selectedMarker?.key && loggedUser?.id) {
        fetchQRCode(selectedMarker.key, loggedUser.id)
      }
    }

    loadQRCode()
  }, [selectedMarker?.key, loggedUser?.id, userHasJoined])
  console.log(selectedMarker?.imageAlbumUrls)
  return (
    <View>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isConfirmationModalVisible}
          onRequestClose={handleCloseConfirmationModal}>
          <View
            style={[
              styles.centeredView,
              { backgroundColor: 'rgba(0,0,0,0.5)' },
            ]}>
            <View
              style={{
                padding: 5,
                margin: 5,
                borderRadius: 7,
                backgroundColor: userHasJoined ? 'transparent' : 'white',
              }}>
              {!userHasJoined ? (
                <Stepper
                  active={active}
                  content={content}
                  onBack={() => setActive(active - 1)}
                  onFinish={() => alert('Finish')}
                  onNext={handleNext}
                  //  termsAccepted={termsAccepted}
                />
              ) : (
                <View style={styles.modalView}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 32,
                      fontWeight: '300',
                    }}>
                    {userHasJoined
                      ? t('map.confirmUnjoinEvent')
                      : t('map.confirmJoinEvent')}
                  </Text>

                  <View style={styles.modalButtonContainer}>
                    <Button
                      style={styles.confirmButton}
                      onPress={handleConfirmJoinUnjoin}>
                      <Text style={{ color: 'white' }}>{t('map.yes')}</Text>
                    </Button>
                    <Button
                      style={styles.cancelButton}
                      onPress={handleCloseConfirmationModal}>
                      <Text style={{ color: 'white' }}>{t('map.no')}</Text>
                    </Button>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {createdByUserId === loggedUser?.id && (
          <TouchableOpacity
            onPress={handleOpenModal}
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <MaterialIcons name="edit" size={26} color="black" />
            <Title style={{ paddingHorizontal: 10 }}>Edit event</Title>
          </TouchableOpacity>
        )}
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <View style={{ flex: 1 }}>
              <Title
                style={[
                  {
                    marginLeft: 10,
                  },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {t('map.eventName')}: {selectedMarker?.eventName}
              </Title>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  marginLeft: 10,
                }}>
                {t('map.maxParticipants')}: {selectedMarker?.maxParticipants}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 5,
              flex: 1,
              alignItems: 'flex-end',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            {qrCode ? (
              <Image
                source={{ uri: `data:image/png;base64,${qrCode}` }}
                style={{
                  width: 95,
                  height: 95,
                }}
              />
            ) : (
              <Text style={{ fontSize: 16 }}>{t('map.noQrAvailable')}</Text>
            )}
          </View>
        </View>

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
                  {t('map.editEventDetails')}
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
                  refreshSelectedMarkerData={refreshSelectedMarkerData}
                  eventId={selectedMarker?.key}
                  eventName={selectedMarker?.eventName}
                  eventImage={selectedMarker?.eventImage}
                  latitude={selectedMarker?.latitude}
                  longitude={selectedMarker?.longitude}
                  otherRelevantInformation={
                    selectedMarker?.otherRelevantInformation
                  }
                  eventDescription={selectedMarker?.eventDescription}
                  maxParticipants={
                    selectedMarker?.maxParticipants
                  }></EditEventForm>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={seeAlbum}
          onRequestClose={() => {
            setSeeAlbum(!seeAlbum)
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
                  {t('Event Images')}
                </Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setSeeAlbum(!seeAlbum)
                  }}>
                  <Icon name="close" size={26} color="white" />
                </TouchableOpacity>
              </View>
              <ImageCarousel
                images={selectedMarker?.imageAlbumUrls}></ImageCarousel>
            </View>
          </View>
        </Modal>
        {selectedMarker && (
          <ParticipantsListContainer
            eventId={Number(selectedMarker?.key)}
            shouldRefreshParticipants={refreshParticipantsTrigger}
            updateParticipantsCount={setParticipantsCount}
            applyMarginHorizontal={true}
          />
        )}

        <View style={{ flexDirection: 'row-reverse', margin: 10 }}>
          <Image
            style={{ width: 28, height: 28, marginLeft: 0 }}
            source={require('../../../assets/Icons/quote (1).png')}
          />
          <Text style={styles.eventDescription}>
            {selectedMarker?.eventDescription}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 5,
          }}>
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
          {drawerVisible && (
            <Image
              style={styles.eventImage}
              source={
                selectedMarker && selectedMarker.eventImage
                  ? {
                      uri: selectedMarker.eventImage,
                    }
                  : { uri: remoteImages.partyImage }
              }
              onLoadStart={() => setIsLoaded(false)}
              onLoadEnd={() => setIsLoaded(true)}
            />
          )}
        </View>
      </TouchableOpacity>
      <ImageModal
        visible={isImageModalVisible}
        imageUrl={selectedMarker?.eventImage ?? ''}
        onClose={() => setIsImageModalVisible(false)}
      />
      {selectedMarker?.imageAlbumUrls &&
      selectedMarker?.imageAlbumUrls.length > 0 ? (
        <TouchableOpacity
          onPress={() => setSeeAlbum(true)}
          style={{ alignContent: 'center', justifyContent: 'center' }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
              marginTop: 10,
            }}>
            <Text style={styles.eventDescription}>See album</Text>
            <MaterialIcons name="collections" size={50} color={'black'} />
          </View>
        </TouchableOpacity>
      ) : null}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 10,
        }}>
        {!userHasJoined && (
          <View style={styles.section}>
            <CheckBox
              style={styles.checkbox}
              checked={isChecked}
              onPress={() => {
                setChecked(!isChecked)
              }}
              title={t('map.showParticipantListPreference')}
              // color={isChecked ? '#4630EB' : undefined}
            />
          </View>
        )}
      </View>

      {selectedMarker && routeDistance && routeDuration && (
        <View>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>
                {t('labels.routeDistance')}:
              </Text>
              <Text style={styles.tableCell}>
                {routeDistance.toFixed(2)} km
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>
                {t('labels.estimatedTimeWithCar')}:
              </Text>
              <Text style={styles.tableCell}>
                {routeDuration.toFixed(1)} min
              </Text>
            </View>
          </View>

          {markers && (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                //  flex: 1,
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  //  style={[styles.closeTraficInfo]}
                  onPress={openGoogleMaps}
                  backgroundColor={'#5dade2'}
                  style={{
                    // width: 'auto',
                    marginBottom: 5,
                    marginRight: 2,
                  }}>
                  <Text style={{ color: 'white' }}>
                    {t('openInGoogleMaps')}
                  </Text>
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  onPress={handleOpenConfirmationModal}
                  disabled={
                    !userHasJoined &&
                    participantsCount === selectedMarker?.maxParticipants
                  }
                  //  backgroundColor={'green'}

                  style={{
                    marginBottom: 5,
                    // width: 'auto',
                    marginLeft: 2,
                    backgroundColor: '#e74c3c',
                  }}>
                  <Text style={styles.joinEvent}>
                    {
                      !userHasJoined &&
                      participantsCount === selectedMarker?.maxParticipants
                        ? t('map.limitReached')
                        : userHasJoined
                          ? t('map.unJoinEvent')
                          : t('map.joinEvent') // Shows based on the user's
                    }
                  </Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default EventDetails
