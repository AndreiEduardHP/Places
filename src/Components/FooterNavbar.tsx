import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  Platform,
} from 'react-native'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { useDarkMode } from '../Context/DarkModeContext'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { config } from '../config/urlConfig'
import axios from 'axios'
import * as Notifications from 'expo-notifications'
import { useFocusEffect } from '@react-navigation/native'
import { Profile, useUser } from '../Context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

type FooterNavProps = {
  style?: TextStyle
  currentRoute: string
}

const FooterNavbar = ({ style, currentRoute }: FooterNavProps) => {
  const handleNavigation = useHandleNavigation()
  const { isDarkMode } = useDarkMode()
  const { loggedUser } = useUser()
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0)
  const fetchUnreadMessagesCount = async (userId: number) => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/chats/unreadMessagesCount`,
        {
          params: { userId },
        },
      )
      setUnreadMessagesCount(response.data.unreadMessagesCount)
    } catch (error) {
      console.error('Error fetching unread messages count:', error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      if (loggedUser?.id) {
        fetchUnreadMessagesCount(loggedUser.id)
      }
    }, [loggedUser?.id]),
  )
  useEffect(() => {
    const initialize = async () => {
      let userId = loggedUser?.id
      if (!userId) {
        const userProfileString = await AsyncStorage.getItem('loggedUser')
        if (userProfileString) {
          const userProfile: Profile = JSON.parse(userProfileString)
          userId = userProfile.id
        }
      }

      if (userId) {
        fetchUnreadMessagesCount(userId)

        const subscription = Notifications.addNotificationReceivedListener(
          () => {
            fetchUnreadMessagesCount(userId)
          },
        )

        return () => {
          subscription.remove()
        }
      }
    }

    initialize()
  }, [loggedUser])

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#2A272A' : '#2A272A',
      paddingHorizontal: 50,
      paddingVertical: Platform.OS === 'ios' ? 14 : 10,
      marginVertical: Platform.OS === 'ios' ? 0 : -6,
      width: '100%',
      zIndex: 2,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    unreadBadge: {
      backgroundColor: 'red',
      borderRadius: 50,
      width: 20,
      height: 20,
      right: -9,
      top: -7,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    unreadText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    icon: {},
    selectedIcon: {
      tintColor: '#00B0EF',
    },
    text: {
      fontWeight: '300',
      alignItems: 'center',
    },
    centralButton: {
      position: 'absolute',
      top: -10,
      backgroundColor: '#00B0EF',
      width: 50,
      height: 50,
      left: '50%',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',

      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      transform: [{ translateX: 20 }],
    },

    curve: {
      position: 'absolute',
      top: -15,
      width: 90,
      zIndex: -1,
      left: '50%',
      height: 180,
      transform: [{ translateX: -1 }],
      backgroundColor: isDarkMode ? '#2A272A' : '#2A272A',
      borderRadius: 40,
    },
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleNavigation('MapScreen')}>
        <Icon
          name="map"
          size={35}
          color={currentRoute === 'MapScreen' ? '#00B0EF' : 'white'}
        />
      </TouchableOpacity>

      <View style={styles.centralButton}>
        <TouchableOpacity
          onPress={() => handleNavigation('NewConnectionScreen')}
          style={{ alignItems: 'center' }}>
          <Icon name="search" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => handleNavigation('Chat')}>
        <View>
          <Icon
            name="chat"
            size={35}
            color={currentRoute === 'Chat' ? '#00B0EF' : 'white'}
          />

          {unreadMessagesCount > 0 && (
            <View
              style={{
                borderRadius: 50,
                width: 20,
                height: 20,
                right: -2,
                top: 1,
                position: 'absolute',
              }}>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadMessagesCount}</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.curve} />
    </View>
  )
}

export default FooterNavbar
