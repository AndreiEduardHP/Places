import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useUser } from '../../Context/AuthContext'
import * as signalR from '@microsoft/signalr'
import { config } from '../../config/urlConfig'

interface Message {
  id: number
  text: string
  senderId: number
  chatId: number
  timestamp: string
}

interface Props {
  messages: Message[]
  selectedRoom: number
  contact: string // Add contact prop
  imageUri: string // Add imageUri prop
  receiverId: number
}

const ChatRoom: React.FC<Props> = ({
  messages,
  selectedRoom,
  contact,
  imageUri,
  receiverId,
}) => {
  const [messageInput, setMessageInput] = useState('')
  const [chatHubConnection, setChatHubConnection] = useState<any>()
  const [messagesData, setMessagesData] = useState<Message[]>(messages)

  const flatListRef = useRef<FlatList<Message>>(null)
  const { loggedUser } = useUser()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100) // Adjust the delay if needed
  }
  useEffect(() => {
    // Inițializează conexiunea SignalR la montarea componentei
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${config.BASE_URL}/chatHub`) // Asigură-te că URL-ul este corect
      .configureLogging(signalR.LogLevel.Information)
      .build()

    connection
      .start()
      .then(() => console.log('Connection started!'))
      .catch((err) => console.error('Connection failed: ', err))

    connection.on('ReceiveMessage', (newMessage) => {
      setMessagesData((currentMessages) => [...currentMessages, newMessage])
    })

    setChatHubConnection(connection)

    return () => {
      // Oprirea conexiunii la demontarea componentei
      connection.stop()
    }
  }, [])
  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return

    // Aici trimiți mesajul folosind conexiunea SignalR
    await chatHubConnection
      ?.send('SendMessage', loggedUser?.id, receiverId, messageInput)
      .then(() => setMessageInput(''))
      .catch((err: any) => console.error('Send message error: ', err))
  }

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}
      keyboardVerticalOffset={100} // Adjust as needed
    >
      <View style={styles.header}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('../../../assets/DefaultUserIcon.png')
          }
          style={styles.profileImage}
        />
        <Text style={styles.contactName}>
          {contact}
          {receiverId}
          {selectedRoom}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Date.now().toString()
          }
          ref={flatListRef}
          data={messagesData}
          renderItem={({ item }) => (
            <View
              style={[
                item.senderId === loggedUser?.id
                  ? styles.messageContainerSender
                  : styles.messageContainer,
              ]}>
              <Text
                style={[
                  item.senderId === loggedUser?.id
                    ? styles.mySenderName
                    : styles.senderName,
                ]}>
                {item.senderId}
              </Text>

              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageInput}
            onChangeText={setMessageInput}
            placeholderTextColor="white"
          />
          <Button title="Send" color={'white'} onPress={handleSendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    borderTopColor: 'white',
    borderWidth: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageContainerSender: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    marginHorizontal: 10,
    // width: 221,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  mySenderName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'red',
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'white',
    marginRight: 10,
  },
})

export default ChatRoom
