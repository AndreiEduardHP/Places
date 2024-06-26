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
import * as Notifications from 'expo-notifications'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { formatDateAndTime } from '../../Utils.tsx/Services/FormatDate'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import { Linking } from 'react-native'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-vector-icons/Icon'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'

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
  contact: string
  imageUri: string
  receiverId: number
  notificationToken: string
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

async function sendPushNotification(
  expoPushToken: string,
  data: any,
  from: string | undefined,
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: from,
    body: 'Sent you a new message!',
    data: { data },
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}

const ChatRoom: React.FC<Props> = ({
  messages,
  selectedRoom,
  contact,
  imageUri,
  receiverId,
  notificationToken,
}) => {
  const [messageInput, setMessageInput] = useState('')
  const [chatHubConnection, setChatHubConnection] = useState<any>()
  const [messagesData, setMessagesData] = useState<Message[]>(messages)
  const [expoPushToken, setExpoPushToken] = useState<any>('')
  const [notification, setNotification] = useState<any>(false)
  const notificationListener = useRef<any>()
  const responseListener = useRef<any>()
  const { loggedUser } = useUser()
  const handleNavigation = useHandleNavigation()
  const flatListRef = useRef<FlatList<Message>>(null)
  const { backgroundColor, textColor } = useThemeColor()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${config.BASE_URL}/chatHub`)
      .configureLogging(signalR.LogLevel.Information)
      .build()

    connection
      .start()
      .then(() => console.log('Connection started!'))
      .catch((err) => console.error('Connection failed: ', err))

    connection.on('ReceiveMessage', async (newMessage) => {
      setMessagesData((currentMessages) => [...currentMessages, newMessage])
      await sendPushNotification(
        notificationToken,
        selectedRoom,
        loggedUser?.firstName,
      )
      scrollToBottom()
    })

    setChatHubConnection(connection)

    return () => {
      connection.stop()
    }
  }, [])
  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return

    await chatHubConnection
      ?.send('SendMessage', loggedUser?.id, receiverId, messageInput)
      .then(() => setMessageInput(''))
      .catch((err: any) => console.error('Send message error: ', err))
  }

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      style={{ flex: 1, backgroundColor: backgroundColor }}
      keyboardVerticalOffset={100}>
      <View style={styles.header}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('../../../assets/DefaultUserIcon.png')
          }
          style={styles.profileImage}
        />
        <Text style={[styles.contactName, { color: textColor }]}>
          {contact}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) =>
            item.id
              ? item.id.toString() + Date.now().toString()
              : Date.now().toString()
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
                  styles.messageText,
                  item.senderId === loggedUser?.id
                    ? { color: 'white' }
                    : { color: 'black' },
                ]}>
                {item.text}
              </Text>
              <Text style={[styles.timestamp]}>
                {formatDateAndTime(new Date(item.timestamp))}
              </Text>
              {item.senderId === loggedUser?.id ? (
                <View style={styles.cornerSender} />
              ) : (
                <View style={styles.cornerReceiver} />
              )}
            </View>
          )}
        />
        <SafeAreaView
          edges={['bottom']}
          style={[styles.inputContainer, { backgroundColor: backgroundColor }]}>
          <View style={styles.input}>
            <TextInput
              placeholder="Type a message..."
              value={messageInput}
              onChangeText={setMessageInput}
              placeholderTextColor={textColor}
              style={{
                color: textColor,
                flex: 1,
                marginRight: 20,
              }}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <MaterialIcons name="arrow-upward" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    marginLeft: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  cornerSender: {
    position: 'absolute',
    bottom: -7,
    right: -8,
    zIndex: -1,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 20,
    borderBottomColor: '#5DB075',
    transform: [{ rotate: '133deg' }],
  },
  cornerReceiver: {
    position: 'absolute',
    bottom: -7,
    left: -8,
    zIndex: -1,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 20,
    borderBottomColor: '#f0f0f0',
    transform: [{ rotate: '-133deg' }],
  },
  header: {
    flexDirection: 'row',

    alignItems: 'center',

    padding: 10,
  },
  messageContainerSender: {
    padding: 10,
    backgroundColor: '#5DB075',
    marginVertical: 5,
    marginRight: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    transform: [{ matrix: [-1, 0, 0, 0, 1, 0, 0, 0, 1] }],
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
    // backgroundColor: ba,

    borderTopColor: '#ccc',
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
})

export default ChatRoom
