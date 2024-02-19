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

interface Message {
  id: number
  sender: string
  message: string
  timestamp: string
}

interface Props {
  messages: Message[]
  onSendMessage: (message: string) => void
  contact: string // Add contact prop
  imageUri: string // Add imageUri prop
}

const ChatRoom: React.FC<Props> = ({
  messages,
  onSendMessage,
  contact,
  imageUri,
}) => {
  const [messageInput, setMessageInput] = useState('')
  const flatListRef = useRef<FlatList<Message>>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100) // Adjust the delay if needed
  }

  const handleSendMessage = () => {
    if (messageInput.trim() !== '') {
      onSendMessage(messageInput)
      setMessageInput('')
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      style={{ flex: 1, backgroundColor: 'white' }}
      keyboardVerticalOffset={120} // Adjust as needed
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
        <Text style={styles.contactName}>{contact}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[
                item.sender === 'You'
                  ? styles.messageContainerSender
                  : styles.messageContainer,
              ]}>
              <Text
                style={[
                  item.sender === 'You'
                    ? styles.mySenderName
                    : styles.senderName,
                ]}>
                {item.sender}
              </Text>

              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageInput}
            onChangeText={setMessageInput}
          />
          <Button title="Send" onPress={handleSendMessage} />
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
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageContainerSender: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
})

export default ChatRoom
