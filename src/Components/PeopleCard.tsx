import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ImageConfig } from '../config/imageConfig'
import { LinearGradient } from 'expo-linear-gradient'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useNotification } from './Notification/NotificationProvider'

type Person = {
  friendRequestStatus: string
  areFriends: boolean
  id: string
  userName: string
  firstName: string
  lastName: string
  phoneNumber: string
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
  currentLocationId: string
  onConnect: () => void
}

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

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.21)', 'rgba(2, 2, 2, 0.30)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.9 }}
      style={styles.item}>
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
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.userName}>Username:</Text>
          <Text
            style={{
              padding: 5,
              color: 'rgba(255,255,255,1)',
              textShadowColor: 'black',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 3,
            }}>
            {username}{' '}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 15 }}>
        <Text style={styles.description}>
          Name: {firstName} {lastName}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.stats}>Interests: {interest}</Text>
      </View>

      <TouchableOpacity style={styles.connect} onPress={onConnect}>
        <Text
          style={{
            color: 'rgba(255,255,255,1)',
            textShadowColor: 'black',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 3,
          }}>
          {areFriends
            ? 'Message'
            : friendRequestStatus === 'Pending'
              ? 'Pending'
              : 'Connect'}
        </Text>
      </TouchableOpacity>
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
      />
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal={true}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginLeft: 16,
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
    width: 90,
    height: 90,
    borderRadius: 50,
    zIndex: 20,
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
    color: 'rgba(255,255,255,1)',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: 'rgba(255,255,255,1)',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  statsContainer: {
    justifyContent: 'space-between',
    marginTop: 5,
  },
  stats: {
    fontSize: 14,
    color: 'rgba(255,255,255,1)',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  connect: {
    fontSize: 14,
    alignItems: 'center',

    marginTop: 15,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    borderColor: 'rgba(255,255,255,1)',

    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
})

export default PeopleCard
