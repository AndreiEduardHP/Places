import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import ChatList from '../../Components/Chat/ChatList'
import ChatRoom from '../../Components/Chat/ChatRoom'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import { useUser } from '../../Context/AuthContext'
import { RouteProp, useRoute } from '@react-navigation/native'
import signalR, { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { sendMessage } from '@microsoft/signalr/dist/esm/Utils'

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
        const chatData: Chat[] = response.data.map((chatProfile) => ({
          id: chatProfile.chatId,
          contact: `${chatProfile.secondUser.firstName} ${chatProfile.secondUser.lastName}`,
          lastMessage:
            chatProfile.messages.length > 0
              ? chatProfile.messages[chatProfile.messages.length - 1].text
              : '',
          imageUri: chatProfile.secondUser.profilePicture,
          messages: chatProfile.messages,
          receiverId: chatProfile.secondUser.id,
          chatId: chatProfile.chatId,
        }))

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
        />
      ) : (
        <ChatList chats={chats} onPressChat={onPressChat} />
      )}
    </View>
  )
}

export default Chat
