import React, { useCallback, useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from 'react-native'
import { ImageConfig } from '../../config/imageConfig'
import FooterNavbar from '../FooterNavbar'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import { useFocusEffect } from '@react-navigation/native'
import LoadingComponent from '../Loading/Loading'
import { Button, Icon, ListItem } from '@rneui/base'
import { Center } from 'native-base'
import BackAction from '../Back'

interface Chat {
  id: number
  contact: string
  // lastMessage: string
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
  const animations = useRef<Animated.Value[]>([]).current

  useFocusEffect(
    useCallback(() => {
      fetchChats()
    }, [fetchChats]),
  )

  useEffect(() => {
    if (animations.length !== chats.length) {
      animations.length = chats.length
      chats.forEach((_, index) => {
        if (!animations[index]) {
          animations[index] = new Animated.Value(0)
        }
      })
    }

    if (chats.length > 0) {
      setLoading(false)
    }
  }, [chats, animations])

  const handleRowClick = (index: number) => {
    console.log('clicck')
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 50, // Move right by 50 units
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: -50, // Move left by 50 units
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: 0, // Move back to original position
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BackAction
          style={{
            backgroundColor: 'white',
            width: 26,
            height: 26,
          }}></BackAction>
        <Text
          style={{
            fontSize: 32,
            fontWeight: '300',
            //  marginHorizontal: 20,
            color: textColor,
            backgroundColor: backgroundColor,
          }}>
          Your connections
        </Text>
      </View>
      <FlatList
        style={{ flex: 1, backgroundColor: backgroundColor }}
        data={chats}
        renderItem={({ item, index }) => {
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
            <ListItem.Swipeable
              containerStyle={{
                backgroundColor: 'transparent',
                height: 60,
                marginTop: 20,
                position: 'relative',
              }}
              leftContent={(reset) => (
                <Button
                  title="Go to profile"
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
                  }
                  titleStyle={{
                    color: textColor, // This sets the text color of the title to red
                  }}
                  icon={{ name: 'people', color: textColor }}
                  buttonStyle={{
                    minHeight: '99%',
                    backgroundColor: 'transparent',

                    zIndex: -1,
                  }}
                />
              )}
              rightContent={(reset: () => void) => (
                <Button
                  title="Go to Chat"
                  onPress={() => onPressChat(item.id)}
                  icon={{ name: 'chat', color: textColor }}
                  titleStyle={{
                    color: textColor, // This sets the text color of the title to red
                  }}
                  containerStyle={{}}
                  buttonStyle={{
                    minHeight: '100%',
                    backgroundColor: 'transparent',
                  }}
                />
              )}>
              <ListItem.Content style={{ marginHorizontal: -2 }}>
                <TouchableWithoutFeedback onPress={() => handleRowClick(index)}>
                  <Animated.View
                    style={{
                      transform: [{ translateX: animations[index] }],
                      zIndex: 2,
                      backgroundColor:
                        textColor === 'black' ? 'rgba(55,55,55,1)' : 'black',
                      borderRadius: 10,
                    }}>
                    <View
                      style={[
                        styles.chatItem,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                        },
                      ]}>
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
                        <Text
                          style={[styles.contactName, { color: textColor }]}>
                          {contact}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 'auto' }}>
                        <ListItem.Chevron />
                      </View>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </ListItem.Content>
            </ListItem.Swipeable>
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
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 3,
    zIndex: 2,
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
