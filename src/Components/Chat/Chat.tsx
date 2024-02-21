import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import ChatList from '../../Components/Chat/ChatList'
import ChatRoom from '../../Components/Chat/ChatRoom'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import { useUser } from '../../Context/AuthContext'
import { RouteProp, useRoute } from '@react-navigation/native'

interface Message {
  id: number
  sender: string
  message: string
  timestamp: string
}

interface Chat {
  id: number
  contact: string
  lastMessage: string
  imageUri: string
  messages: Message[]
}
interface ChatRouteParams {
  chatId?: number // Make chatId optional as it may not always be provided
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
        const response = await axios.get(
          `${config.BASE_URL}/api/userprofile/${loggedUser?.id}`,
        )
        const users = response.data

        const chatData = users.map(
          (user: {
            id: any
            firstName: any
            lastName: any
            lastMessage: any
            profilePicture: any
          }) => ({
            id: user.id,
            contact: `${user.firstName} ${user.lastName}`,
            lastMessage: user.lastMessage,
            imageUri: user.profilePicture,
            messages: [],
          }),
        )
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

  const sendMessage = (message: string) => {
    if (selectedChat) {
      const newMessage: Message = {
        id: selectedChat.messages.length + 1,
        sender: 'You', // Assuming the sender is the current user
        message,
        timestamp: new Date().toLocaleString(),
      }
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
      }
      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat.id ? updatedChat : chat,
      )
      setChats(updatedChats)
      setSelectedChat(updatedChat)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {selectedChat ? (
        <ChatRoom
          messages={selectedChat.messages}
          onSendMessage={sendMessage}
          contact={selectedChat?.contact || ''}
          imageUri={selectedChat?.imageUri || ''}
        />
      ) : (
        <ChatList chats={chats} onPressChat={onPressChat} />
      )}
    </View>
  )
}

export default Chat
