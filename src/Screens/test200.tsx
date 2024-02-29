import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { HubConnectionBuilder } from '@microsoft/signalr'

const ChatComponent = () => {
  const [connection, setConnection] = useState<any>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('http://192.168.1.2:8080/chatHub')
      .withAutomaticReconnect()
      .build()

    connect
      .start()
      .then(() => {
        console.log('Connected!')
        setConnection(connect)
      })
      .catch((err) => console.log('Error while connecting: ', err))

    return () => {
      connect.stop()
    }
  }, [])

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveMessage', (user: string, message: string) => {
        setMessages((prevMessages) => [...prevMessages, `${user}: ${message}`])
      })
    }
  }, [connection])

  const sendMessage = async () => {
    if (connection) {
      try {
        await connection.send('SendMessage', 'User', input)
        setInput('')
      } catch (err) {
        console.log('Sending message error:', err)
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
})

export default ChatComponent
