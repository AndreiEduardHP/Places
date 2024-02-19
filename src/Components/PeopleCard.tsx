import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
  Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ImageConfig } from '../config/imageConfig'
import { LinearGradient } from 'expo-linear-gradient'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import { useNavigation } from '@react-navigation/native'
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

const DATA: Person[] = []

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
      colors={[
        'rgba(243, 243, 112, 0.01)',
        'rgba(243, 243, 112, 0.03)',
        'rgba(24, 23, 12, 0.01)',
        'rgba(0, 0, 0, 0.05)',
        'rgba(0, 0, 0, 0.15)',
        'rgba(0, 0, 0, 0.25)',
        'rgba(0, 0, 0, 0.35)',
        'rgba(0, 0, 0, 0.45)',
        'rgba(0, 0, 0, 0.55)',
        'rgba(0, 0, 0, 0.65)',
        'rgba(0, 0, 0, 0.75)',
        'rgba(0, 0, 0, 0.85)',
        'rgba(0, 0, 0, 0.89)',
      ]}
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
            source={{
              uri: profilePicture
                ? ImageConfig.IMAGE_CONFIG + profilePicture
                : 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png',
            }}
          />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.userName}>Username:</Text>
          <Text
            style={{
              padding: 5,
              color: 'white',
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
      {/* Add functionality for the Connect button */}
      <TouchableOpacity style={styles.connect} onPress={onConnect}>
        <Text
          style={{
            color: 'white',
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
  useEffect(() => {
    fetchData()
  }, [])

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
      handleConnect(personId) // Call onConnect function if not pending or message
    }
  }

  const handleConnect = async (personId: number) => {
    try {
      const requestBody = {
        SenderId: loggedUser?.id,
        ReceiverId: personId,
      }

      const response = await axios.post(
        `${config.BASE_URL}/api/Friend/sendFriendRequest`,
        requestBody,
      )

      console.log(response.data) // Log success message
      // Optionally update the state to reflect the change in friend status
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  // Inside your functional component
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
        currentLocationId={item.currentLocationId} // Assuming each item in data already has an `areFriends` property
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
    // backgroundColor: 'white',
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
      android: {
        elevation: 10,
      },
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
  },
  userName: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  statsContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  stats: {
    fontSize: 14,
    color: 'white',
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
    borderColor: 'white',

    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
})

export default PeopleCard
