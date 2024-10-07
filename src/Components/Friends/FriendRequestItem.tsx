import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { FriendRequest, useUser } from '../../Context/AuthContext'
import { formatDateAndTime } from '../../Utils.tsx/Services/FormatDate'
import { Avatar } from '@rneui/base'
import { useNotification } from '../Notification/NotificationProvider'
import {
  acceptFriendRequest,
  declineFriendRequest,
} from '../../Services/FriendService'

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
  const { showNotificationMessage } = useNotification()
  const declineFriend = async (requestId: number) => {
    const result = await declineFriendRequest(requestId)
    showNotificationMessage(
      result?.message ? result.message : 'error',
      result?.success ? result.success : 'fail',
    )
    fetchFriendRequests()
  }

  const acceptFriend = async (requestId: number) => {
    const result = await acceptFriendRequest(requestId)
    showNotificationMessage(
      result?.message ? result.message : 'error',
      result?.success ? result.success : 'fail',
    )
    fetchFriendRequests()
  }

  return (
    <View
      style={[styles.requestContainer, { backgroundColor: backgroundColor }]}>
      <Avatar source={{ uri: item.senderPicture }} rounded size="medium" />
      <Text style={{ color: textColor }}>{item.senderName}</Text>
      <Text style={{ color: textColor }}>
        {formatDateAndTime(new Date(item.requestDate))}
      </Text>
      <Button title="Accept" onPress={() => acceptFriend(item.requestId)} />
      <Button title="Decline" onPress={() => declineFriend(item.requestId)} />
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
