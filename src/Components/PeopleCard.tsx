import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  Modal,
  ScrollView,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ImageConfig } from '../config/imageConfig'
import { config } from '../config/urlConfig'
import { Profile, useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useNotification } from './Notification/NotificationProvider'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Notifications from 'expo-notifications'
import {
  Button,
  ButtonGroup,
  SearchBar,
  CheckBox,
  ListItem,
  Skeleton,
} from '@rneui/base'
import LoadingComponent from './Loading/Loading'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import { Card, Title } from 'react-native-paper'
import LineComponent from './LineComponent'
import { interests } from '../Utils.tsx/Enums/Interests'
import { haversineDistance } from './EventsAroundYou'
import { Divider } from 'native-base'
import { ChatRoomProps } from '../Navigation/Types'
import * as Location from 'expo-location'
import { t } from 'i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FriendRequestModal from './Friends/FriendRequestModal'
import { useFocusEffect } from '@react-navigation/native'
import { getLocation } from '../Services/CurrentLocation'
import { Person } from '../Interfaces/IUserData'

type ItemProps = {
  friendRequestStatus: string
  areFriends: boolean
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  description: string
  interest: string
  profilePicture: string
  username: string
  city: string
  notificationToken: string
  currentLocationId: string
  onConnect: () => void
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const Item: React.FC<ItemProps & { additionalStyles?: object }> = ({
  friendRequestStatus,
  areFriends,
  id,
  firstName,
  lastName,
  phoneNumber,
  email,
  interest,
  profilePicture,
  additionalStyles,
  username,
  city,
  notificationToken,
  currentLocationId,
  description,
  onConnect,
}) => {
  const navigate = useHandleNavigation()
  const { textColor, backgroundColor } = useThemeColor()
  const { loggedUser, fetchFriendRequests } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDescription, setIsOpenDescription] = useState(false)
  const [loading, setLoading] = useState(true)

  const loggedUserInterests = loggedUser?.interest
    ? loggedUser.interest.split(',').map((i) => i.trim())
    : []

  const personInterests = interest
    ? interest.split(',').map((i) => i.trim())
    : []

  useFocusEffect(
    React.useCallback(() => {
      if (loggedUser?.id) {
        fetchFriendRequests()
      }
    }, [loggedUser?.id]),
  )
  useEffect(() => {
    const initialize = async () => {
      let userId = loggedUser?.id

      if (!userId) {
        const userProfileString = await AsyncStorage.getItem('loggedUser')
        if (userProfileString) {
          const userProfile: Profile = JSON.parse(userProfileString)
          userId = userProfile.id
        }
      }

      if (userId) {
        fetchFriendRequests()

        const subscription = Notifications.addNotificationReceivedListener(
          () => {
            fetchFriendRequests()
          },
        )

        return () => {
          subscription.remove()
        }
      }
    }

    initialize()
  }, [loggedUser])

  const styles = StyleSheet.create({
    item: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginTop: 15,
      marginHorizontal: 5,
      borderRadius: 15,
      borderColor:
        backgroundColor === 'white'
          ? 'rgba(0,0,0,0.5)'
          : 'rgba(255,255,255,0.5)',
      borderWidth: 1,
      backgroundColor: 'rgba(255,255,255,0.11)',
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    title: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
      paddingLeft: 10,
      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
    card: {
      backgroundColor:
        textColor == 'white' ? 'rgba(48, 51, 55,1)' : 'rgba(252,252,255,1)',
      marginHorizontal: 10,
      marginBottom: 20,
      ...additionalStyles,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    icon: {
      marginRight: 5,
    },
    dateAndTime: {
      fontSize: 16,
      color: textColor,
      marginTop: 5,
    },
    locationAddress: {
      fontSize: 16,
      color: textColor,
      textAlign: 'left',
      paddingRight: 15,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 100,
      marginRight: 15,
      marginBottom: 15,
    },
    userName: {
      fontSize: 20,
      fontWeight: '500',
      color: textColor,
    },
    description: {
      fontSize: 14,
      marginTop: 5,
      color: textColor,
    },
    statsContainer: {
      justifyContent: 'space-between',
      marginTop: 10,
    },
    stats: {
      marginTop: 10,
      fontSize: 14,
      color: textColor,
    },
    connectButton: {
      marginTop: 20,
      backgroundColor:
        textColor === 'white' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    connectButtonText: {
      color:
        backgroundColor === 'white' ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)',
      fontSize: 16,
      fontWeight: '500',
    },
    commonInterest: {
      color: '#00B0EF',
      fontWeight: 'bold',
    },
    profileImageContainer: {
      width: 150,
      height: 150,
      borderRadius: 100,
      marginRight: 15,
      marginBottom: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

  return (
    <Card style={styles.card}>
      <Card.Content style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() =>
            navigate('SelectedPersonInfo', {
              personData: {
                friendRequestStatus,
                areFriends,
                id,
                username,
                firstName,
                lastName,
                phoneNumber,
                description,
                email,
                interest,
                profilePicture,
                city,
                currentLocationId,
                notificationToken,
              },
            })
          }>
          <Image
            style={styles.profileImage}
            source={
              profilePicture && profilePicture.trim() !== ''
                ? { uri: profilePicture }
                : require('../../assets/DefaultUserIcon.png')
            }
            onLoadStart={() => {
              setLoading(true)
            }}
            onLoadEnd={() => {
              setLoading(false)
            }}
            resizeMode="cover"
          />
          {loading && (
            <Skeleton
              animation="wave"
              style={[styles.profileImage, { position: 'absolute', zIndex: 1 }]}
            />
          )}
        </TouchableOpacity>
      </Card.Content>
      <Card.Content>
        <Title style={{ color: textColor, paddingLeft: 15 }}>
          {firstName} {lastName.charAt(0)}
        </Title>

        <LineComponent />

        <ListItem.Accordion
          containerStyle={{ backgroundColor: 'transparent' }}
          content={
            <>
              <ListItem.Content style={{}}>
                <ListItem.Title>
                  <View style={[styles.infoContainer]}>
                    <MaterialIcons
                      name="description"
                      size={26}
                      color={textColor}
                      style={styles.icon}
                    />
                    <View style={{ width: 250 }}>
                      <Text
                        style={[styles.dateAndTime, { marginRight: 20 }]}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        Description:{' '}
                        <Text>
                          {description.length === 0 || description === '-'
                            ? 'No description'
                            : description}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={isOpenDescription}
          onPress={() => setIsOpenDescription(!isOpenDescription)}
          icon={
            description.length > 1 ? (
              <Icon name="keyboard-arrow-down" size={30} color={textColor} />
            ) : (
              {}
            )
          }>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={styles.locationAddress}> {description}</Text>
          </View>
        </ListItem.Accordion>

        <ListItem.Accordion
          containerStyle={{ backgroundColor: 'transparent' }}
          content={
            <>
              <ListItem.Content style={{ backgroundColor: 'transparent' }}>
                <ListItem.Title>
                  <View style={styles.infoContainer}>
                    <MaterialIcons
                      name="star"
                      size={26}
                      color={textColor}
                      style={styles.icon}
                    />
                    <View
                      style={{ width: personInterests.length > 1 ? 250 : 300 }}>
                      <Text style={styles.locationAddress} numberOfLines={1}>
                        Interests:{' '}
                        {personInterests.length === 0 && 'No interests'}
                        <Text style={styles.locationAddress}>
                          {personInterests.map((personInterest, index) => {
                            const isCommonInterest =
                              loggedUserInterests.includes(personInterest)
                            return (
                              <Text
                                key={index}
                                style={
                                  isCommonInterest
                                    ? styles.commonInterest
                                    : undefined
                                }>
                                {personInterest}
                                {index < personInterests.length - 1 && ', '}
                              </Text>
                            )
                          })}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={personInterests.length > 1 ? isOpen : false}
          onPress={() => setIsOpen(!isOpen)}
          icon={
            personInterests.length > 1 ? (
              <Icon name="keyboard-arrow-down" size={30} color={textColor} />
            ) : (
              {}
            )
          }>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={styles.locationAddress}>
              {personInterests.map((personInterest, index) => {
                const isCommonInterest =
                  loggedUserInterests.includes(personInterest)
                return (
                  <Text
                    key={index}
                    style={
                      isCommonInterest ? styles.commonInterest : undefined
                    }>
                    {personInterest}
                    {index < personInterests.length - 1 && ', '}
                  </Text>
                )
              })}
            </Text>
          </View>
        </ListItem.Accordion>
      </Card.Content>
      <Card.Actions>
        <Button
          buttonStyle={{
            backgroundColor: 'rgba(10,10,10,1)',
          }}
          titleStyle={{ fontWeight: '400', fontSize: 18 }}
          containerStyle={{
            marginVertical: 5,
            width: 210,
          }}
          onPress={onConnect}>
          {friendRequestStatus === 'Accepted'
            ? t('peopleCard.message')
            : friendRequestStatus === 'Pending'
              ? t('peopleCard.pending')
              : t('peopleCard.connect')}
        </Button>
      </Card.Actions>
    </Card>
  )
}

const PeopleCard: React.FC = () => {
  const [data, setData] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { loggedUser } = useUser()
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [notification, setNotification] = useState<any>(false)
  const notificationListener = useRef<any>()
  const [expoPushToken, setExpoPushToken] = useState<any>('')
  const responseListener = useRef<any>()

  const [isInterestModalVisible, setIsInterestModalVisible] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [distance, setDistance] = useState<number>(10)
  const [filterFriendRequestStatus, setFilterFriendRequestStatus] =
    useState(false)
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [isFriendRequestModalVisible, setIsFriendRequestModalVisible] =
    useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const { friendRequestsCount } = useUser()

  const closeFriendRequestModal = () => {
    setIsFriendRequestModalVisible(false)
    setSelectedPerson(null)
  }
  const fetchLocation = useCallback(async () => {
    const location = await getLocation('lowest')
    if (location) {
      setCurrentLocation(location)
    }
  }, [])

  useEffect(() => {
    fetchLocation()
  }, [refreshTrigger, distance, getLocation])

  const fetchData = useCallback(async () => {
    if (isFriendRequestModalVisible === true) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }

    let userId = loggedUser?.id

    // Dacă utilizatorul nu este încă disponibil, încearcă să îl obții din AsyncStorage
    if (!userId) {
      const userProfileString = await AsyncStorage.getItem('loggedUser')
      if (userProfileString) {
        const userProfile: Profile = JSON.parse(userProfileString)
        userId = userProfile.id
      }
    }

    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/UserProfile/${userId}`,
      )
      const data = response.data

      const loggedUserInterests = loggedUser?.interest
        ? loggedUser.interest.split(',').map((i) => i.trim().toLowerCase())
        : []

      const hasCommonInterests = (personInterests: string) => {
        const personInterestsArray = personInterests
          ? personInterests.split(',').map((i) => i.trim().toLowerCase())
          : []
        return personInterestsArray.some((interest) =>
          loggedUserInterests.includes(interest),
        )
      }

      const sortedData = data
        .filter((person: Person) => {
          const personCoords = {
            latitude: person.currentLatitude,
            longitude: person.currentLongitude,
          }
          const userCoords = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }

          const distanceBetween = haversineDistance(userCoords, personCoords)
          return distanceBetween <= distance
        })
        .sort((a: Person, b: Person) => {
          const aHasCommon = hasCommonInterests(a.interest)
          const bHasCommon = hasCommonInterests(b.interest)
          if (aHasCommon && !bHasCommon) return -1
          if (!aHasCommon && bHasCommon) return 1
          return 0
        })

      setData(sortedData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [distance, currentLocation, friendRequestsCount])

  useEffect(() => {
    if (currentLocation) {
      fetchData()
    }
  }, [currentLocation, fetchData])

  useFocusEffect(
    useCallback(() => {
      if (currentLocation) {
        fetchData()
      }
      return () => {}
    }, [currentLocation]),
  )

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {})

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const registerForPushNotificationsAsync = async () => {
    let token

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }

    token = (await Notifications.getExpoPushTokenAsync()).data
    return token
  }

  const sendPushNotification = async (notificationToken: string) => {
    const message = [
      {
        to: notificationToken,
        sound: 'default',
        title: 'You have a new friend request',
        body: `${loggedUser?.firstName} ${loggedUser?.lastName} sent you a friend request!`,
        data: { someData: 'goToNotification' },
      },
    ]
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }

  const handleSendMessage = async (item: Person) => {
    try {
      const chatId = await retrieveChatId(Number(item.id))

      const chatRoomProps: ChatRoomProps = {
        selectedRoom: chatId,
        contact: `${item?.firstName} ${item?.lastName}`,
        imageUri: item?.profilePicture || '',
        firstName: item?.firstName ? item.firstName : 'First Name',
        lastName: item?.lastName ? item.firstName : 'Last Name',
        description: item?.description || '',
        profilePicture: item?.profilePicture || '',
        friendRequestStatus: item?.friendRequestStatus || '',
        areFriends: item?.areFriends || false,
        username: item?.username || '',
        phoneNumber: item?.phoneNumber || '',
        email: item?.email || '',
        interest: item?.interest || '',
        city: item?.city || '',
        currentLocationId: item?.currentLocationId ? parseInt('1') : 1,
        receiverId: Number(item?.id) || 0,
        notificationToken: item?.notificationToken || '',
      }

      handleNavigation('ChatRoom', chatRoomProps)
    } catch (error) {
      console.error('Error navigating to chat:', error)
      showNotificationMessage('Failed to navigate to chat', 'fail')
    }
  }

  const handleConnectPress = async (
    friendRequestStatus: string,
    personId: number,
    item: Person,
  ) => {
    if (friendRequestStatus === 'Pending') {
      showNotificationMessage('Friend request is already pending.', 'neutral')
    } else if (friendRequestStatus === 'Accepted') {
      handleSendMessage(item)
    } else {
      handleConnect(personId)
    }
  }

  const retrieveChatId = async (userId2: number): Promise<number> => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/Chats/GetChatRoom`,
        {
          params: {
            user1: loggedUser?.id,
            user2: userId2,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('Error retrieving chat ID:', error)
      throw new Error('Could not retrieve chat ID')
    }
  }

  const handleConnect = async (personId: number) => {
    try {
      const requestBody = {
        SenderId: loggedUser?.id,
        ReceiverId: personId,
        Latitude: currentLocation.latitude,
        Longitude: currentLocation.longitude,
      }

      await axios.post(
        `${config.BASE_URL}/api/Friend/sendFriendRequest`,
        requestBody,
      )
      setRefreshTrigger((prev) => !prev)
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }
  const filteredData = useMemo(() => {
    return data.filter((person) => {
      const matchesSearchQuery =
        person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.lastName.toLowerCase().includes(searchQuery.toLowerCase())

      const personInterests = person.interest
        .split(',')
        .map((i) => i.trim().toLowerCase())
      const matchesInterests =
        selectedInterests.length === 0 ||
        selectedInterests.every((interest) =>
          personInterests.includes(interest.toLowerCase()),
        )

      const matchesFriendRequestStatus =
        !filterFriendRequestStatus || person.friendRequestStatus === 'Accepted'

      return (
        matchesSearchQuery && matchesInterests && matchesFriendRequestStatus
      )
    })
  }, [data, searchQuery, selectedInterests, filterFriendRequestStatus])
  const renderItem = useCallback(
    ({ item, index }: { item: Person; index: number }) => {
      return (
        <Item
          username={item.username}
          firstName={item.firstName}
          lastName={item.lastName}
          interest={item.interest}
          description={item.description}
          profilePicture={item.profilePicture}
          areFriends={item.areFriends}
          friendRequestStatus={item.friendRequestStatus}
          onConnect={() => {
            handleConnectPress(item.friendRequestStatus, Number(item.id), item)

            if (
              !(
                item.friendRequestStatus === 'Pending' ||
                item.friendRequestStatus === 'Accepted'
              )
            ) {
              sendPushNotification(item.notificationToken)
              showNotificationMessage(
                'Friend requeste sent succesfully',
                'success',
              )
            }
          }}
          id={item.id}
          phoneNumber={item.phoneNumber}
          email={item.email}
          city={item.city}
          currentLocationId={item.currentLocationId}
          notificationToken={item.notificationToken}
          additionalStyles={
            index === 0
              ? { marginTop: 10 }
              : index === filteredData.length - 1
                ? { marginBottom: 40 }
                : {}
          }
        />
      )
    },
    [filteredData],
  )

  const toggleFriendRequestStatusFilter = () => {
    setFilterFriendRequestStatus(!filterFriendRequestStatus)
  }

  const { textColor } = useThemeColor()

  const styles = StyleSheet.create({
    input: {
      //  backgroundColor: useThemeColor().backgroundColor,
    },
    container: {
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    inputContainer: {},
    title: {
      fontSize: 22,
      paddingLeft: 10,
      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
    searchInput: {
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 1,
      borderRadius: 10,
      borderColor: textColor,
      borderWidth: 1,
      marginRight: 5,
      color: textColor,
      fontSize: 15,
    },
    modalContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '100%',
      height: 650,
      padding: 0,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    modalOption: {
      fontSize: 18,
      color: 'white',
    },
    card: {
      margin: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    icon: {
      marginRight: 5,
    },
    dateAndTime: {
      fontSize: 16,
      color: textColor,
      marginTop: 5,
    },
    locationAddress: {
      fontSize: 16,
      color: textColor,
    },
    pickerContainer: {
      marginHorizontal: 15,
      marginTop: 10,
      borderColor: textColor,
      borderWidth: 1,
      borderRadius: 10,
    },
    picker: {
      height: 50,
      width: '100%',
    },
    searchBarContainer: {
      backgroundColor: 'transparent',
      paddingVertical: 5,
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    checkboxContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    checkboxWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      margin: 0,
      marginTop: 10,
      padding: 0,
    },
  })

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={{ flex: 1 }}>
          <LoadingComponent />
          <SearchBar
            inputContainerStyle={{
              backgroundColor:
                textColor === 'white'
                  ? 'rgba(35,35,35,1)'
                  : 'rgba(225,225,225,1)',
              height: 34,
            }}
            containerStyle={styles.searchBarContainer}
            placeholder={t('peopleCard.searchPlaceholder')}
            placeholderTextColor={textColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>{t('peopleCard.peopleAroundYou')}</Text>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <SearchBar
            inputContainerStyle={{
              backgroundColor:
                textColor === 'white'
                  ? 'rgba(35,35,35,1)'
                  : 'rgba(225,225,225,1)',
              height: 34,
            }}
            inputStyle={styles.input}
            containerStyle={styles.searchBarContainer}
            placeholder={t('peopleCard.searchPlaceholder')}
            placeholderTextColor={textColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>{t('peopleCard.peopleAroundYou')}</Text>
            <TouchableOpacity onPress={() => setIsInterestModalVisible(true)}>
              <MaterialIcons
                name="filter-list"
                size={26}
                color={textColor}
                style={{ marginRight: 20 }}
              />
            </TouchableOpacity>
          </View>

          {friendRequestsCount > 0 && (
            <TouchableOpacity
              onPress={() => setIsFriendRequestModalVisible(true)}>
              <View
                style={{
                  marginHorizontal: 10,
                  backgroundColor: 'rgba(170,20,87,0.6)',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderRadius: 5,
                  marginTop: 5,
                }}>
                <Title
                  style={{
                    fontSize: 14,
                    color: textColor,
                    paddingLeft: 5,
                  }}>
                  You have new friend requests
                </Title>

                <Title
                  style={{
                    color: textColor,
                    paddingHorizontal: 18,
                    fontSize: 16,
                  }}>
                  {friendRequestsCount}
                </Title>
              </View>
            </TouchableOpacity>
          )}
          <FriendRequestModal
            visible={isFriendRequestModalVisible}
            onClose={closeFriendRequestModal}
          />

          {filteredData.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text style={{ color: textColor, fontSize: 32 }}>
                {t('labels.noPeopleAroundYou')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      )}

      <Modal
        transparent={true}
        visible={isInterestModalVisible}
        onRequestClose={() => setIsInterestModalVisible(false)}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={[
                styles.title,
                {
                  color: 'black',
                  fontSize: 24,
                  marginVertical: 10,
                  fontWeight: '400',
                },
              ]}>
              {t('labels.selectInterest')}
            </Text>
            <Divider />
            <ScrollView contentContainerStyle={{}}>
              <View style={styles.checkboxContainer}>
                {interests.map((interest) => (
                  <View key={interest} style={styles.checkboxWrapper}>
                    <CheckBox
                      title={interest}
                      checked={selectedInterests.includes(interest)}
                      onPress={() => toggleInterest(interest)}
                      containerStyle={styles.checkbox}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
            <Text
              style={[
                styles.title,
                {
                  color: 'black',
                  fontSize: 24,
                  marginTop: 10,
                  fontWeight: '400',
                },
              ]}>
              {t('labels.moreFilters')}
            </Text>
            <CheckBox
              title="Show friends"
              checked={filterFriendRequestStatus}
              onPress={toggleFriendRequestStatusFilter}
              containerStyle={styles.checkbox}
            />

            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '500',
                padding: 10,
              }}>
              {t('labels.selectRadiusPeople')}
            </Text>
            <ButtonGroup
              selectedButtonStyle={{ backgroundColor: 'black' }}
              buttons={['10Km', '50Km', 'All']}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value)
                setDistance(value === 0 ? 10 : value === 1 ? 50 : 100000000000)
              }}
              containerStyle={{ marginBottom: 20 }}
            />
            <Button
              onPress={() => setIsInterestModalVisible(false)}
              buttonStyle={{
                backgroundColor: 'black',
                margin: 10,
              }}>
              <Text style={styles.modalOption}>{t('buttons.close')}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default PeopleCard
