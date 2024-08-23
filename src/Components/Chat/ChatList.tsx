import React, { useCallback } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import FooterNavbar from '../FooterNavbar'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import { useFocusEffect } from '@react-navigation/native'
import LoadingComponent from '../Loading/Loading'
import { ListItem } from '@rneui/base'

import BackAction from '../Back'
import { t } from 'i18next'

interface Chat {
  id: number
  contact: string

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
  description: string
  city: string
  currentLocationId: number
  unreadMessagesCount: number
}

interface Props {
  chats: Chat[]
  onPressChat: (chatId: number) => void
  fetchChats: () => void
  error: string | null
  loading: boolean | null
  refreshData: (value: boolean) => void
}

const ChatList: React.FC<Props> = ({
  chats,
  onPressChat,
  loading,
  refreshData,
}) => {
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()
  const navigate = useHandleNavigation()

  useFocusEffect(
    useCallback(() => {
      refreshData(true)
    }, []),
  )

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <>
      {chats.length > 0 ? (
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BackAction
              style={{
                width: 26,
                height: 26,
              }}
            />
            <Text
              style={{
                fontSize: 28,
                fontWeight: '300',
                color: textColor,
                backgroundColor: backgroundColor,
              }}>
              {t('labels.yourConnections')}
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
                unreadMessagesCount,
                description,
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
                  }}>
                  <ListItem.Content style={{ marginHorizontal: -2 }}>
                    <TouchableOpacity onPress={() => onPressChat(item.id)}>
                      <View
                        style={{
                          zIndex: 2,
                          backgroundColor:
                            textColor === 'black'
                              ? backgroundColorGrey
                              : backgroundColorGrey,
                          borderRadius: 10,
                        }}>
                        <View
                          style={[
                            styles.chatItem,
                            {
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              justifyContent: 'center',
                            }}>
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
                                    description,
                                    email,
                                    interest,
                                    profilePicture,
                                    city,
                                    currentLocationId,
                                  },
                                })
                              }>
                              <Image
                                source={
                                  imageUri !== ''
                                    ? { uri: imageUri }
                                    : require('../../../assets/DefaultUserIcon.png')
                                }
                                style={styles.image}
                              />
                            </TouchableOpacity>

                            <View
                              style={{
                                alignContent: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.contactName,
                                  {
                                    color: textColor,
                                  },
                                ]}>
                                {contact}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              marginLeft: 'auto',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              {unreadMessagesCount > 0 && (
                                <View
                                  style={{
                                    borderRadius: 50,
                                    backgroundColor: 'red',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                  }}>
                                  <Text
                                    style={{
                                      color: textColor,
                                      textAlign: 'center',
                                    }}>
                                    {unreadMessagesCount}
                                  </Text>
                                </View>
                              )}

                              <ListItem.Chevron
                                size={23}
                                color={
                                  textColor === 'black' ? 'black' : 'white'
                                }
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </ListItem.Content>
                </ListItem.Swipeable>
              )
            }}
            keyExtractor={(item) => item.id.toString()}
          />
          <FooterNavbar currentRoute={'Chat'} />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
          <View
            style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
            <Text style={{ color: textColor }}>No records found</Text>
          </View>
          <FooterNavbar currentRoute={'Chat'} />
        </View>
      )}
    </>
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
    fontSize: 17,
    fontWeight: '400',
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
