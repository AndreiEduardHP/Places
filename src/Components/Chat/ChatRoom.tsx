import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useUser } from '../../Context/AuthContext'
import * as signalR from '@microsoft/signalr'
import { config } from '../../config/urlConfig'
import * as Notifications from 'expo-notifications'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { formatDateAndTime } from '../../Utils.tsx/Services/FormatDate'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import BackAction from '../Back'
import axios from 'axios'
import { RootStackParamList } from '../../Navigation/Types'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { Message } from '../../Interfaces/IChat'

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
type ChatRoomScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ChatRoom'>
  route: RouteProp<RootStackParamList, 'ChatRoom'>
}
const ChatRoom: React.FC<ChatRoomScreenProps> = ({ route, navigation }) => {
  const {
    selectedRoom,
    contact,
    imageUri,
    firstName,
    lastName,
    description,
    profilePicture,
    friendRequestStatus,
    areFriends,
    username,
    phoneNumber,
    email,
    interest,
    city,
    currentLocationId,
    receiverId,
    notificationToken,
  } = route.params

  const [messageInput, setMessageInput] = useState('')
  const [chatHubConnection, setChatHubConnection] = useState<any>()
  const [messagesData, setMessagesData] = useState<Message[]>([])
  const { loggedUser } = useUser()
  const flatListRef = useRef<FlatList<Message>>(null)
  const { backgroundColor, textColor } = useThemeColor()
  const navigate = useHandleNavigation()

  const [initialMessages, setInitialMessages] = useState<number>(40)

  useEffect(() => {
    if (loggedUser && selectedRoom) {
      markMessagesAsRead(selectedRoom, loggedUser.id)
    }
  }, [selectedRoom, loggedUser, messagesData])

  useEffect(() => {
    fetchData()
  }, [selectedRoom, initialMessages])
  const fetchData = async () => {
    const messages = await processMessagesWithSeparators(selectedRoom)
    setMessagesData(messages)
  }
  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 1500)
  }, [])
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: any } }
  }) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY === 0) {
      //  loadMoreMessages()
    }
  }
  const processMessagesWithSeparators = async (
    selectedRoom: number,
  ): Promise<Message[]> => {
    const processedMessages: Message[] = []
    let lastDate = ''

    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/chats/getChatMessages?chatId=${selectedRoom}&numberOfMessages=${initialMessages}`,
      )
      const messages: Message[] = response.data // presupunând că API-ul returnează un array de mesaje de tip Message

      messages.forEach((message) => {
        const messageDate = new Date(message.timestamp).toDateString()
        if (messageDate !== lastDate) {
          lastDate = messageDate
          processedMessages.push({
            id: Date.now() + Math.random(), // unique id for the separator
            text: messageDate,
            chatId: selectedRoom,
            dateSeparator: true,
            senderId: message.senderId,
            timestamp: message.timestamp,
          })
        }
        processedMessages.push(message)
      })
    } catch (error) {
      console.error('Error fetching messages:', error)
      // Poți trata eroarea aici în funcție de necesități (afișare unui mesaj de eroare, gestionarea erorilor etc.)
    }

    return processedMessages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
  }
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${config.BASE_URL}/chatHub`, {
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
        headers: {
          // Pass any additional headers if necessary
          userId1: loggedUser?.id?.toString() || '',
          userId2: receiverId?.toString() || '',
        },
      })
      .build()

    connection.start().catch((err) => console.error('Connection failed: ', err))

    connection.on('ReceiveMessage', async (newMessage) => {
      setMessagesData((currentMessages) => [...currentMessages, newMessage])
      await sendPushNotification(
        notificationToken,
        selectedRoom,
        loggedUser?.firstName,
      )

      scrollToBottom()
    })
    scrollToBottom()
    setChatHubConnection(connection)

    return () => {
      connection.stop()
    }
  }, [])
  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return

    try {
      await chatHubConnection
        ?.send('SendMessage', loggedUser?.id, receiverId, messageInput)
        .then(() => {
          setMessageInput('')
        })
        .catch((err: any) => {
          console.error('Send message error: ', err)
        })
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
    }
  }
  const loadMoreMessages = async () => {
    setInitialMessages(initialMessages + 10)
  }
  const markMessagesAsRead = async (chatId: number, userId: number) => {
    try {
      await axios.post(
        `${config.BASE_URL}/api/chats/markAsRead?ChatId=${chatId}&UserId=${userId}`,
      )
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  type ItemProps = {
    item: {
      senderId: number
      text: string
      timestamp: string
      dateSeparator?: boolean
    }
  }

  const Item = ({ item }: ItemProps) => {
    if (item.dateSeparator) {
      return (
        <View style={styles.dateSeparatorContainer}>
          <Text style={styles.dateSeparatorText}>{item.text}</Text>
        </View>
      )
    }
    return (
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
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 75, android: 10 })}
      style={{ flex: 1, backgroundColor: backgroundColor }}>
      <View style={styles.header}>
        <BackAction></BackAction>
        <TouchableOpacity
          onPress={() =>
            navigate('SelectedPersonInfo', {
              personData: {
                friendRequestStatus,
                areFriends,
                receiverId,
                username,
                firstName,
                lastName,
                phoneNumber,
                profilePicture,
                email,
                interest,
                description,
                city,
                currentLocationId,
              },
            })
          }
          style={{
            flexDirection: 'row-reverse',
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
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
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messagesData}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          onLayout={scrollToBottom}
          onScroll={handleScroll}
          scrollEventThrottle={20}
        />
        <SafeAreaView
          edges={['bottom']}
          style={[styles.inputContainer, { backgroundColor: backgroundColor }]}>
          <View style={styles.input}>
            <TextInput
              placeholder={
                friendRequestStatus !== 'Deleted' &&
                friendRequestStatus !== 'Pending' &&
                friendRequestStatus !== 'Declined'
                  ? 'Type a message...'
                  : 'You are not friends anymore'
              }
              value={messageInput}
              onChangeText={setMessageInput}
              placeholderTextColor={textColor}
              editable={
                friendRequestStatus !== 'Deleted' &&
                friendRequestStatus !== 'Declined' &&
                friendRequestStatus !== 'Pending'
              }
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
  dateSeparatorContainer: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 14,
    color: '#333',
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
    justifyContent: 'space-between',
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
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  contactName: {
    fontSize: 26,
    fontWeight: '400',
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
    marginBottom: Platform.OS === 'ios' ? 2 : 10,
    color: 'white',
  },
})

export default ChatRoom
