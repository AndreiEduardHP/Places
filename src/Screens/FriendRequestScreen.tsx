import React from 'react'
import { View, Text, FlatList, Button, StyleSheet } from 'react-native'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { FriendRequest, useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import { useNotification } from '../Components/Notification/NotificationProvider'

const FriendRequestScreen = () => {
  const { fetchFriendRequests, friendRequests } = useUser()
  const { showNotificationMessage } = useNotification()

  const declineFriendRequest = async (requestId: number) => {
    showNotificationMessage(`Declining friend request ${requestId}`, 'neutral')
  }

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestContainer}>
      <Text>{item.senderName}</Text>
      <Text>{item.requestDate}</Text>
      <Button
        title="Accept"
        onPress={() => acceptFriendRequest(item.requestId)}
      />
      <Button
        title="Decline"
        onPress={() => declineFriendRequest(item.requestId)}
      />
    </View>
  )

  const acceptFriendRequest = async (requestId: number) => {
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/Friend/acceptFriendRequest/${requestId}`,
      )
      if (response.status === 200) {
        alert('Friend request accepted.')
        fetchFriendRequests() // Refresh the friend requests list
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
      alert('Failed to accept friend request.')
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {friendRequests.length > 0 ? (
        <FlatList
          data={friendRequests}
          renderItem={renderFriendRequest}
          keyExtractor={(item) => item.requestId.toString()}
        />
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 50,
            alignItems: 'center',
          }}>
          <Text style={styles.noRequest}>No requests</Text>
        </View>
      )}
      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
}

const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noRequest: {
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -0.4,
  },
})

export default FriendRequestScreen
