import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import ChatList from '../../Components/Chat/ChatList'
import ChatRoom from '../../Components/Chat/ChatRoom'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import { useUser } from '../../Context/AuthContext'
import { RouteProp, useRoute } from '@react-navigation/native'
import moment from 'moment'

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
}

interface ChatProfile {
  chatId: number
  currentUser: UserProfile
  secondUser: UserProfile
  messages: Message[]
}

interface Chat {
  id: number
  contact: string
  lastMessage: string
  imageUri: string
  receiverId: number
  chatId: number
  notificationToken: string
  messages: Message[]
}

interface ChatRouteParams {
  chatId?: number
}

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const { loggedUser } = useUser()
  const route = useRoute<RouteProp<{ params: ChatRouteParams }, 'params'>>()
  const chatId = route.params?.chatId

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await axios.get<ChatProfile[]>(
          `${config.BASE_URL}/api/chats?userId=${loggedUser?.id}`,
        )
        const chatData: Chat[] = response.data.map((chatProfile) => {
          const messages = chatProfile.messages.map((message) => ({
            ...message,
            timestamp: moment.utc(message.timestamp).local().format(),
          }))

          return {
            id: chatProfile.chatId,
            contact: `${chatProfile.secondUser.firstName} ${chatProfile.secondUser.lastName}`,
            lastMessage:
              messages.length > 0 ? messages[messages.length - 1].text : '',
            imageUri: chatProfile.secondUser.profilePicture,
            messages: messages,
            notificationToken: chatProfile.secondUser.notificationToken,
            receiverId: chatProfile.secondUser.id,
            chatId: chatProfile.chatId,
          }
        })
        setChats(chatData)

        if (chatId) {
          const selectedChatData = chatData.find(
            (chat: any) => chat.id === Number(chatId),
          )
          setSelectedChat(selectedChatData || null)
        }
      } catch (error) {
        console.error('Error fetching user profiles:', error)
      }
    }

    fetchChats()
  }, [])

  const onPressChat = (chatId: number) => {
    const selectedChatData = chats.find((chat) => chat.id === chatId)
    setSelectedChat(selectedChatData || null)
  }

  return (
    <View style={{ flex: 1 }}>
      {selectedChat ? (
        <ChatRoom
          messages={selectedChat.messages}
          selectedRoom={selectedChat.chatId}
          contact={selectedChat?.contact || ''}
          imageUri={selectedChat?.imageUri || ''}
          receiverId={selectedChat.receiverId}
          notificationToken={selectedChat.notificationToken}
        />
      ) : (
        <ChatList chats={chats} onPressChat={onPressChat} />
      )}
    </View>
  )
}

export default Chat
