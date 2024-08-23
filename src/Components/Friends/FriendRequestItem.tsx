import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { FriendRequest, useUser } from '../../Context/AuthContext'
import { formatDateAndTime } from '../../Utils.tsx/Services/FormatDate'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { Avatar } from '@rneui/base'
import axios from 'axios'
import { config } from '../../config/urlConfig'

type FriendRequestItemProps = {
  item: FriendRequest
  backgroundColor: string
  textColor: string
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  item,
  backgroundColor,
  textColor,
}) => {
  const { fetchFriendRequests } = useUser()
  const declineFriendRequest = async (requestId: number) => {
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/Friend/declineFriendRequest/${requestId}`,
      )
      if (response.status === 200) {
        alert('Friend request declined.')
        fetchFriendRequests()
      }
    } catch (error) {
      console.error('Error declining friend request:', error)
      alert('Failed to decline friend request.')
    }
  }

  const acceptFriendRequest = async (requestId: number) => {
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/Friend/acceptFriendRequest/${requestId}`,
      )
      if (response.status === 200) {
        alert('Friend request accepted.')
        fetchFriendRequests()
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
      alert('Failed to accept friend request.')
    }
  }

  return (
    <View
      style={[styles.requestContainer, { backgroundColor: backgroundColor }]}>
      <Avatar source={{ uri: item.senderPicture }} rounded size="medium" />
      <Text style={{ color: textColor }}>{item.senderName}</Text>
      <Text style={{ color: textColor }}>
        {formatDateAndTime(new Date(item.requestDate))}
      </Text>
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
}

const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
})

export default FriendRequestItem
