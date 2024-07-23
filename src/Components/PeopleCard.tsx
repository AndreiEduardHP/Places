import React, { useEffect, useRef, useState } from 'react'
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
import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useNotification } from './Notification/NotificationProvider'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Notifications from 'expo-notifications'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup, SearchBar, CheckBox } from '@rneui/base'
import LoadingComponent from './Loading/Loading'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import { Card, Paragraph, Title } from 'react-native-paper'
import LineComponent from './LineComponent'
import { remoteImages } from '../AzureImages/Images'
import { interests } from '../Utils.tsx/Interests/Interests'

type Person = {
  friendRequestStatus: string
  areFriends: boolean
  id: string
  userName: string
  firstName: string
  lastName: string
  phoneNumber: string
  notificationToken: string
  email: string
  interest: string
  profilePicture: string
  username: string
  city: string
  currentLocationId: string
}

type ItemProps = {
  friendRequestStatus: string
  areFriends: boolean
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
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

const Item: React.FC<ItemProps> = ({
  friendRequestStatus,
  areFriends,
  id,
  firstName,
  lastName,
  phoneNumber,
  email,
  interest,
  profilePicture,
  username,
  city,
  currentLocationId,
  onConnect,
}) => {
  const navigate = useHandleNavigation()
  const { textColor, backgroundColor } = useThemeColor()
  const { loggedUser } = useUser()
  const { t } = useTranslation()

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
    searchInput: {
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 1,
      borderRadius: 10,
      borderColor: textColor,
      borderWidth: 1,
      marginRight: 15,
      color: textColor,
      fontSize: 15,
    },
    card: {
      backgroundColor:
        textColor == 'white' ? 'rgba(48, 51, 55,1)' : 'rgba(122,212,112,1)',
      margin: 10,
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
      width: 120,
      height: 120,
      borderRadius: 10,
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
  })

  {
    /*   <Card containerStyle={{ backgroundColor: backgroundColor }}>
      <View style={styles.profileContainer}>
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
                email,
                interest,
                profilePicture,
                city,
                currentLocationId,
              },
            })
          }>
          <Image
            style={styles.profileImage}
            source={
              profilePicture
                ? { uri: ImageConfig.IMAGE_CONFIG + profilePicture }
                : require('../../assets/DefaultUserIcon.png')
            }
          />
        </TouchableOpacity>
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
                email,
                interest,
                profilePicture,
                city,
                currentLocationId,
              },
            })
          }>
          <Card.Title style={styles.userName}>
            {' '}
            {firstName} {lastName} {id} {}
          </Card.Title>
          <Text style={[styles.userName, { textAlign: 'right' }]}>
            {username}
          </Text>
        </TouchableOpacity>
      </View>
      <Card.Divider />
      <Text style={styles.stats}>
        {t('peopleCard.interests')}: {interest}
      </Text>
      <Button
        containerStyle={{
          marginVertical: 10,
        }}
        buttonStyle={{ backgroundColor: 'rgba(49, 49, 49, 1)' }}
        onPress={onConnect}
        title={
          friendRequestStatus === 'Accepted'
            ? t('peopleCard.message')
            : friendRequestStatus === 'Pending'
              ? t('peopleCard.pending')
              : t('peopleCard.connect')
        }>
        {/* <Text style={styles.connectButtonText}>
         
        </Text>
      </Button>
    </Card>*/
  }
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
                email,
                interest,
                profilePicture,
                city,
                currentLocationId,
              },
            })
          }>
          <Image
            style={styles.profileImage}
            source={
              profilePicture
                ? { uri: ImageConfig.IMAGE_CONFIG + profilePicture }
                : require('../../assets/DefaultUserIcon.png')
            }
          />
        </TouchableOpacity>
      </Card.Content>
      <Card.Content>
        <TouchableOpacity
          style={{ marginTop: 10 }}
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
                email,
                interest,
                profilePicture,
                city,
                currentLocationId,
              },
            })
          }>
          <Title style={{ color: textColor }}>
            {firstName} {lastName}
          </Title>

          <Title style={{ color: textColor, marginBottom: 10 }}>
            Username: {username}
          </Title>
        </TouchableOpacity>
        <LineComponent />
        <View style={styles.infoContainer}>
          <MaterialIcons
            name="description"
            size={26}
            color={textColor}
            style={styles.icon}
          />
          <Text style={styles.dateAndTime}>Description: not yet</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons
            name="star"
            size={26}
            color={textColor}
            style={styles.icon}
          />
          <Text style={styles.locationAddress}>Interests: {interest}</Text>
        </View>
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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isInterestModalVisible, setIsInterestModalVisible] = useState(false)

  // State for search query
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [distance, setDistance] = useState(5)
  const [filterFriendRequestStatus, setFilterFriendRequestStatus] =
    useState(false)

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/UserProfile/${loggedUser?.id}`,
      )
      setData(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

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

  async function registerForPushNotificationsAsync() {
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

  async function sendPushNotification(notificationToken: string) {
    const message = [
      {
        to: notificationToken,
        sound: 'default',
        title: 'You have a new friend request',
        body: `${loggedUser?.firstName} ${loggedUser?.lastName} sent you a friend request!`,
        data: { someData: 'goes here' },
      },
    ]
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }

  const handleConnectPress = async (
    friendRequestStatus: string,
    personId: number,
  ) => {
    console.log(friendRequestStatus, personId)
    if (friendRequestStatus === 'Pending') {
      showNotificationMessage('Friend request is already pending.', 'neutral')
    } else if (friendRequestStatus === 'Accepted') {
      const chatId = await retrieveChatId(personId)
      console.log(chatId)
      handleNavigation('Chat', { chatId: chatId })
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

  const renderItem = ({ item }: { item: Person }) => {
    return (
      <Item
        username={item.username}
        firstName={item.firstName}
        lastName={item.lastName}
        interest={item.interest}
        profilePicture={item.profilePicture}
        areFriends={item.areFriends}
        friendRequestStatus={item.friendRequestStatus}
        onConnect={() => {
          handleConnectPress(item.friendRequestStatus, Number(item.id))
          if (
            !(
              item.friendRequestStatus === 'Pending' ||
              item.friendRequestStatus === 'Accepted'
            )
          ) {
            sendPushNotification(item.notificationToken)
          }
        }}
        id={item.id}
        phoneNumber={item.phoneNumber}
        email={item.email}
        city={item.city}
        currentLocationId={item.currentLocationId}
        notificationToken={item.notificationToken}
      />
    )
  }
  const toggleFriendRequestStatusFilter = () => {
    setFilterFriendRequestStatus(!filterFriendRequestStatus)
  }

  // Filter data based on search query and selected interests
  const filteredData = data.filter((person) => {
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

    return matchesSearchQuery && matchesInterests && matchesFriendRequestStatus
  })

  const { textColor } = useThemeColor()
  const { t } = useTranslation()

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
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
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
      justifyContent: 'center',
      //  alignItems: 'center',
      //  marginHorizontal: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '100%',

      height: 650,
      padding: 0,
      backgroundColor: 'white',
      borderRadius: 10,
      //  alignItems: 'center',
    },
    modalOption: {
      fontSize: 18,
      color: 'white',
      //  marginVertical: 10,
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
    searchBarContainer: { backgroundColor: 'transparent' },
    checkboxContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    checkboxWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      //  marginTop: 5,
    },
    checkbox: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  })

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingComponent />
        <SearchBar
          lightTheme={textColor == 'white' ? false : true}
          containerStyle={styles.searchBarContainer}
          placeholder={t('peopleCard.searchPlaceholder')}
          placeholderTextColor={textColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{t('peopleCard.peopleAroundYou')}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <MaterialIcons
              name="filter-list"
              size={26}
              color={textColor}
              style={{
                marginRight: 20,
                marginTop: 14,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        lightTheme={textColor == 'white' ? false : true}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        containerStyle={styles.searchBarContainer}
        placeholder={t('peopleCard.searchPlaceholder')}
        placeholderTextColor={textColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>{t('peopleCard.peopleAroundYou')}</Text>
        {/* <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <MaterialIcons
            name="filter-list"
            size={26}
            color={textColor}
            style={{
              marginRight: 20,
              marginTop: 14,
            }}
          />
        </TouchableOpacity>*/}
        <TouchableOpacity onPress={() => setIsInterestModalVisible(true)}>
          <MaterialIcons
            name="filter-list"
            size={26}
            color={textColor}
            style={{
              marginRight: 20,
              marginTop: 14,
            }}
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isInterestModalVisible}
        onRequestClose={() => setIsInterestModalVisible(false)}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.title, { color: 'black' }]}>
              Select interests:
            </Text>
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
                { color: 'black', fontSize: 24, fontWeight: '400' },
              ]}>
              More Filters
            </Text>
            <CheckBox
              title="Show only accepted friends"
              checked={filterFriendRequestStatus}
              onPress={toggleFriendRequestStatusFilter}
              containerStyle={styles.checkbox}
            />
            <Button
              onPress={() => setIsInterestModalVisible(false)}
              buttonStyle={{
                backgroundColor: 'black',
                margin: 20,
              }}>
              <Text style={styles.modalOption}>Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

export default PeopleCard
