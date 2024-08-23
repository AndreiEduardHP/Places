import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import ChatList from '../../Components/Chat/ChatList'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import { useUser } from '../../Context/AuthContext'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'

interface Message {
  id: number
  text: string
  senderId: number
  chatId: number
  timestamp: string
}

interface UserProfile {
  id: number
  firstName: string
  lastName: string
  notificationToken: string
  profilePicture: string
  friendRequestStatus: string
  areFriends: boolean
  username: string
  description: string
  phoneNumber: string
  email: string
  interest: string
  city: string
  currentLocationId: number
}

interface ChatProfile {
  chatId: number
  currentUser: UserProfile
  secondUser: UserProfile
  messages: Message[]
  friendRequestStatus: string
  areFriends: boolean
  unreadMessagesCount: number
}

interface Chat {
  id: number
  contact: string
  imageUri: string
  receiverId: number
  chatId: number
  notificationToken: string
  friendRequestStatus: string
  areFriends: boolean
  username: string
  firstName: string
  lastName: string
  profilePicture: string
  phoneNumber: string
  email: string
  description: string
  interest: string
  city: string
  currentLocationId: number
  unreadMessagesCount: number
}

export interface ChatRouteParams {
  data?: number | null
  chatId?: number | null
  [key: string]: any
}

const Chat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const { loggedUser } = useUser()
  const numberOfMessages = 20
  const route = useRoute<RouteProp<{ params: ChatRouteParams }, 'params'>>()
  const chatId = route.params?.data ? route.params?.data : route.params?.chatId
  const navigation = useNavigation()
  const [error, setError] = useState<string | null>(null)
  const handleNavigation = useHandleNavigation()
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshData, setRefreshData] = useState(false)

  useEffect(() => {
    fetchChats()
  }, [loggedUser, chatId, refreshData])

  const fetchChats = async () => {
    if (!loggedUser) return

    try {
      const response = await axios.get<ChatProfile[]>(
        `${config.BASE_URL}/api/chats?userId=${loggedUser.id}&numberOfMessages=${numberOfMessages}`,
      )
      const chatData: Chat[] = response.data.map((chatProfile) => {
        return {
          id: chatProfile.chatId,
          contact: `${chatProfile.secondUser.firstName} ${chatProfile.secondUser.lastName.charAt(0)}`,
          imageUri: chatProfile.secondUser.profilePicture,
          notificationToken: chatProfile.secondUser.notificationToken,
          receiverId: chatProfile.secondUser.id,
          chatId: chatProfile.chatId,
          profilePicture: chatProfile.secondUser.profilePicture,
          friendRequestStatus: chatProfile.friendRequestStatus,
          areFriends: chatProfile.areFriends,
          username: chatProfile.secondUser.username,
          firstName: chatProfile.secondUser.firstName,
          lastName: chatProfile.secondUser.lastName,
          phoneNumber: chatProfile.secondUser.phoneNumber,
          email: chatProfile.secondUser.email,
          description: chatProfile.secondUser.description,
          interest: chatProfile.secondUser.interest,
          city: chatProfile.secondUser.city,
          currentLocationId: chatProfile.secondUser.currentLocationId,
          unreadMessagesCount: chatProfile.unreadMessagesCount,
        }
      })
      setChats(
        chatData.sort((a, b) => b.unreadMessagesCount - a.unreadMessagesCount),
      )

      if (chatId) {
        const selectedChatData = chatData.find(
          (chat: any) => chat.id === Number(chatId),
        )
        if (route.params?.data || route.params?.chatId) {
          // @ts-ignore
          navigation.setParams({ data: null as any, chatId: null as any })
        }
        if (selectedChatData) {
          navigateToChatRoom(selectedChatData)
        }
      }
    } catch (error) {
      setError('Error fetching user profiles:')
    } finally {
      setLoading(false)
      setRefreshData(false)
    }
  }

  const onPressChat = (chatId: number) => {
    const selectedChatData = chats.find((chat) => chat.id === chatId)
    if (selectedChatData) {
      navigateToChatRoom(selectedChatData)
    }
  }

  const navigateToChatRoom = (chat: Chat) => {
    handleNavigation('ChatRoom', {
      selectedRoom: chat.chatId,
      contact: chat.contact,
      imageUri: chat.imageUri,
      receiverId: chat.receiverId,
      notificationToken: chat.notificationToken,
      firstName: chat.firstName,
      lastName: chat.lastName,
      profilePicture: chat.profilePicture,
      friendRequestStatus: chat.friendRequestStatus,
      areFriends: chat.areFriends,
      username: chat.username,
      phoneNumber: chat.phoneNumber,
      email: chat.email,
      interest: chat.interest,
      city: chat.city,
      currentLocationId: chat.currentLocationId,
      description: chat.description,
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <ChatList
        chats={chats}
        onPressChat={onPressChat}
        fetchChats={fetchChats}
        error={error}
        loading={loading}
        refreshData={setRefreshData}
      />
    </View>
  )
}

export default Chat
