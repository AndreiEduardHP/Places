import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { ImageConfig } from '../../config/imageConfig'
import FooterNavbar from '../FooterNavbar'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import { useFocusEffect } from '@react-navigation/native'
import LoadingComponent from '../Loading/Loading'

interface Chat {
  id: number
  contact: string
  lastMessage: string
  imageUri: string
  firstName: string
  lastName: string
  receiverId: number
  profilePicture: string
  friendRequestStatus: string
  areFriends: boolean
  username: string
  phoneNumber: string
  email: string
  interest: string
  city: string
  currentLocationId: number
}

interface Props {
  chats: Chat[]
  onPressChat: (chatId: number) => void
  fetchChats: () => void
}

const ChatList: React.FC<Props> = ({ chats, onPressChat, fetchChats }) => {
  const { backgroundColor, textColor } = useThemeColor()
  const navigate = useHandleNavigation()
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      handleContentSizeChange()
      fetchChats()
    }, [fetchChats]),
  )

  const handleContentSizeChange = () => {
    if (chats.length > 0) {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingComponent></LoadingComponent>
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1, backgroundColor: backgroundColor }}
        data={chats}
        renderItem={({ item }) => {
          const {
            receiverId,
            friendRequestStatus,
            areFriends,
            username,
            firstName,
            lastName,
            phoneNumber,
            email,
            interest,
            profilePicture,
            city,
            currentLocationId,
            contact,
            imageUri,
          } = item

          return (
            <>
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
                      email,
                      interest,
                      profilePicture,
                      city,
                      currentLocationId,
                    },
                  })
                }>
                <Text style={{ color: 'white' }}>sfasfasf</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPressChat(item.id)}
                style={styles.chatItem}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View>
                    <Image
                      source={
                        imageUri !== ''
                          ? { uri: ImageConfig.IMAGE_CONFIG + imageUri }
                          : require('../../../assets/DefaultUserIcon.png')
                      }
                      style={styles.image}
                    />
                  </View>
                  <View style={{ paddingTop: 4 }}>
                    <Text style={[styles.contactName, { color: textColor }]}>
                      {contact}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={22}
                    color="#FFFFFF"
                    style={{ marginLeft: 'auto' }}
                  />
                </View>
              </TouchableOpacity>
            </>
          )
        }}
        keyExtractor={(item) => item.id.toString()}
      />
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

const styles = StyleSheet.create({
  chatItem: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 16,
    color: 'white',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
})

export default ChatList
