import React from 'react'
import { View, Text, FlatList, Button, StyleSheet } from 'react-native'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { FriendRequest, useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import { useNotification } from '../Components/Notification/NotificationProvider'
import { useTranslation } from 'react-i18next'
import { formatDateAndTime } from '../Utils.tsx/Services/FormatDate'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import BackAction from '../Components/Back'

const FriendRequestScreen = () => {
  const { fetchFriendRequests, friendRequests } = useUser()
  const { showNotificationMessage } = useNotification()
  const { t } = useTranslation()
  const themeColors = useThemeColor()
  const { textColor } = useThemeColor()

  const declineFriendRequest = async (requestId: number) => {
    showNotificationMessage(`Declining friend request ${requestId}`, 'neutral')
  }

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => {
    return (
      <View
        style={[
          styles.requestContainer,
          { backgroundColor: themeColors.backgroundColor },
        ]}>
        <Text style={{ color: themeColors.textColor }}>{item.senderName}</Text>
        <Text style={{ color: themeColors.textColor }}>
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
    <View style={{ flex: 1, backgroundColor: themeColors.backgroundColor }}>
      {friendRequests.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BackAction
              style={{
                width: 26,
                height: 26,
                backgroundColor: 'white',
              }}></BackAction>
            <Text
              style={{
                color: textColor,
                //   marginTop: 10,
                //   marginLeft: 10,
                fontSize: 28,
              }}>
              Your friend requests
            </Text>
          </View>
          <FlatList
            data={friendRequests}
            renderItem={renderFriendRequest}
            keyExtractor={(item) => item.requestId.toString()}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 50,
            alignItems: 'center',
            backgroundColor: themeColors.backgroundColor,
          }}>
          <Text style={[styles.noRequest, { color: themeColors.textColor }]}>
            {t('friendRequestScreen.noRequests')}
          </Text>
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
