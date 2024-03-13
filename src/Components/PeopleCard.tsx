import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ImageConfig } from '../config/imageConfig'
import { LinearGradient } from 'expo-linear-gradient'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useNotification } from './Notification/NotificationProvider'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Notifications from 'expo-notifications'

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
  notificationToken,
  email,
  interest,
  profilePicture,
  username,
  city,
  currentLocationId,
  onConnect,
}) => {
  const navigate = useHandleNavigation()
  const { textColor } = useThemeColor()
  const [isExpanded, setIsExpanded] = useState(false)
  const { loggedUser } = useUser()
  const [expoPushToken, setExpoPushToken] = useState<any>('')
  const [notification, setNotification] = useState<any>(false)
  const notificationListener = useRef<any>()
  const responseListener = useRef<any>()

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
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
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync()).data

    return token
  }

  async function sendPushNotification(notificationToken: string) {
    console.log(notificationToken)

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
    console.log(response)
  }
  const styles = StyleSheet.create({
    title: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
      paddingLeft: 10,
      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '400',
      ...Platform.select({
        ios: {
          textShadowColor: 'black',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        },
      }),
    },
    item: {
      paddingHorizontal: 20,
      paddingVertical: 7,
      marginTop: 5,
      marginHorizontal: 16,
      borderColor: 'rgba(0,0,0,0.2)',
      borderWidth: 1,
      borderRadius: 6,
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        android: {},
      }),
    },

    profileContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 50,
      zIndex: 20,
      opacity: 0.9,
    },
    userName: {
      fontSize: 20,
      fontWeight: '400',
      marginLeft: 10,
      color: textColor,
      textShadowColor: 'black',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 4,
    },
    description: {
      fontSize: 14,
      marginTop: 5,
      color: textColor,
    },
    statsContainer: {
      justifyContent: 'space-between',
      marginTop: 5,
    },
    stats: {
      fontSize: 14,
      color: textColor,
    },
    connect: {
      fontSize: 14,
      alignItems: 'center',

      marginTop: 15,
      borderWidth: 2,
      borderRadius: 10,
      padding: 5,
      borderColor: textColor,
    },
  })
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.21)', 'rgba(2, 2, 2, 0.30)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.9 }}
      style={[
        styles.item,
        {
          borderColor:
            textColor === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          borderWidth: 1,
        },
      ]}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={styles.profileImage}
              source={
                profilePicture
                  ? { uri: ImageConfig.IMAGE_CONFIG + profilePicture }
                  : require('../../assets/DefaultUserIcon.png')
              }
            />
            <Text
              style={{
                padding: 5,
                marginLeft: 10,
                color: textColor,
                fontSize: 24,
              }}>
              {firstName} {lastName}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleExpand}>
          <Icon
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={45}
            color={textColor === 'white' ? 'white' : 'black'}></Icon>
        </TouchableOpacity>
      </View>
      {isExpanded && (
        <View>
          <View style={{ marginTop: 15 }}>
            <Text style={styles.description}>
              Name: {firstName} {lastName}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.stats}>Interests: {interest}</Text>
          </View>

          <TouchableOpacity
            style={styles.connect}
            onPress={() => {
              onConnect()
              sendPushNotification(notificationToken)
            }}>
            <Text
              style={{
                color: textColor,
              }}>
              {areFriends
                ? 'Message'
                : friendRequestStatus === 'Pending'
                  ? 'Pending'
                  : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  )
}

const PeopleCard: React.FC = () => {
  const [data, setData] = useState<Person[]>([])
  const { loggedUser } = useUser()
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/UserProfile/${loggedUser?.id}`,
      )
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleConnectPress = (
    friendRequestStatus: string,
    personId: number,
  ) => {
    if (friendRequestStatus === 'Pending') {
      showNotificationMessage('Friend request is already pending.', 'neutral')
    } else if (friendRequestStatus === 'Accepted') {
      handleNavigation('Chat', { chatId: personId })
    } else {
      handleConnect(personId)
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
        onConnect={() =>
          handleConnectPress(item.friendRequestStatus, Number(item.id))
        }
        id={item.id}
        phoneNumber={item.phoneNumber}
        email={item.email}
        city={item.city}
        currentLocationId={item.currentLocationId}
        notificationToken={item.notificationToken}
      />
    )
  }
  const { textColor } = useThemeColor()
  const styles = StyleSheet.create({
    title: {
      marginLeft: 10,
      marginTop: 10,
      fontSize: 32,
      paddingLeft: 10,
      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
  })
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>People around you</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={false}
      />
    </View>
  )
}

export default PeopleCard
