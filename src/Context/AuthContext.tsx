import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import { config } from '../config/urlConfig'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNotification } from '../Components/Notification/NotificationProvider'
import i18n from '../TranslationFiles/i18n'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { MapMarker } from 'react-native-maps'
import * as Location from 'expo-location'

export interface Profile {
  id: number
  profileVisibility: string
  username: string
  email: string
  city: string
  interest: string
  firstName: string
  lastName: string
  phoneNumber: string
  profilePicture: string
  themeColor: string
  credit: number
  shares: number
  currentLatitude: number
  currentLongitude: number
  languagePreference: string
  dateAccountCreation: string
  notificationToken: string
}

interface UserContextType {
  loggedUser: Profile | null
  setLoggedUser: Dispatch<SetStateAction<Profile | null>>
  token: string | null
  setToken: Dispatch<SetStateAction<string | null>>
  handleLogin: (phoneNumber: string) => Promise<void>
  handleLogout: () => void
  refreshData: () => void
  updateProfileImage: (imageFile: any, userProfileId: number) => Promise<void>
  friendRequests: FriendRequest[]
  setFriendRequests: Dispatch<SetStateAction<FriendRequest[]>>
  friendRequestsCount: number
  fetchFriendRequests: () => Promise<void>
  updateNotificationToken: (
    userProfileId: number,
    notificationToken: string,
  ) => Promise<void>
  fetchFriendCount: (userId: number) => Promise<number>
}

export const UserContext = createContext<UserContextType>({
  loggedUser: null,
  setLoggedUser: () => {},
  token: null,
  setToken: () => {},
  updateNotificationToken: async (
    userProfileId: number,
    notificationToken: string,
  ) => {
    console.warn('updateProfileImage function is not implemented')
  },
  handleLogin: async () => {},
  handleLogout: () => {},
  refreshData: () => {},
  fetchFriendCount: (userId: number) => Promise.resolve(0),
  updateProfileImage: async (imageFile: any, userProfileId: number) => {
    console.warn('updateProfileImage function is not implemented')
  },
  friendRequests: [],
  setFriendRequests: () => {},
  friendRequestsCount: 0,
  fetchFriendRequests: async () => {
    console.warn('fetchFriendRequests function is not implemented')
  },
})

interface UserProviderProps {
  children: ReactNode
}
export interface FriendRequest {
  requestId: number
  senderName: string
  requestDate: string
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [loggedUser, setLoggedUser] = useState<Profile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [friendRequestsCount, setFriendRequestsCount] = useState<number>(0)
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()
  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        const tokenExpirationDate = await AsyncStorage.getItem(
          'tokenExpirationDate',
        )
        if (tokenExpirationDate) {
          const expirationDate = new Date(tokenExpirationDate)
          if (expirationDate <= new Date()) {
            handleLogout()
          }
          const storedLoggedUser = await AsyncStorage.getItem('loggedUser')
          if (storedLoggedUser) {
            const parsedLoggedUser = JSON.parse(storedLoggedUser)

            setLoggedUser(parsedLoggedUser)
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error)
      }
    }

    checkTokenExpiration()

    const checkTokenExpirationInterval = setInterval(
      () => {
        checkTokenExpiration()
      },
      24 * 60 * 60 * 1000,
    )
    return () => clearInterval(checkTokenExpirationInterval)
  }, [])

  const fetchFriendCount = async (userId: number): Promise<number> => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/Friend/count/${loggedUser?.id}`,
        {
          headers: {},
        },
      )
      return response.data
    } catch (error) {
      console.error('Error fetching friend count:', error)
      throw error
    }
  }

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('Permission to access location was denied')
        return null
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      if (location) {
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error getting current location:', error)
      return null
    }
  }

  const fetchFriendRequests = async () => {
    if (loggedUser) {
      try {
        const response = await axios.get<FriendRequest[]>(
          `${config.BASE_URL}/api/Friend/pendingFriendRequests/${loggedUser.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        setFriendRequests(response.data)
        setFriendRequestsCount(response.data.length)
      } catch (error) {
        console.error('Failed to fetch friend requests:', error)
      }
    }
  }

  const updateNotificationToken = async (
    userProfileId: number,
    notificationToken: string,
  ) => {
    try {
      await axios.post(
        `${config.BASE_URL}/api/UserProfile/UpdateUserNotificationToken/${userProfileId}?notificationToken=${notificationToken}`,

        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    } catch (error) {
      console.error('Network error:', error)
    }
  }
  const handleLogin = async (phoneNumber: string) => {
    try {
      const authResponse = await axios.post(
        `${config.BASE_URL}/api/auth/login`,
        { PhoneNumber: phoneNumber },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const newToken = authResponse.data.token

      setToken(newToken)

      if (newToken) {
        let token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        })

        const profileResponse = await axios.get(
          `${config.BASE_URL}/api/UserProfile/GetUserProfileByPhone/${phoneNumber}`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        )
        updateUserNotificationToken(profileResponse.data.id, token.data)

        setLoggedUser(profileResponse.data)

        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + 3)
        const profileData: Profile = profileResponse.data
        await AsyncStorage.setItem('loggedUser', JSON.stringify(profileData))
        await AsyncStorage.setItem('token', newToken)
        await AsyncStorage.setItem(
          'tokenExpirationDate',
          expirationDate.toISOString(),
        )
        handleNavigation('HomeScreen')
        if (profileResponse.data.languagePreference) {
          i18n.changeLanguage(profileResponse.data.languagePreference)
        } else {
          i18n.changeLanguage('en')
        }

        showNotificationMessage('Login authentication successful 👍', 'success')
      } else {
        console.error('Token is missing or undefined.')
      }
    } catch (error) {
      showNotificationMessage('Number not found! ', 'fail')
    }
  }
  const updateUserNotificationToken = async (
    userProfileId: number | undefined,
    notificationToken: string,
  ) => {
    try {
      const location = await getLocation()
      if (location) {
        const url = `${config.BASE_URL}/api/userprofile/UpdateUserNotificationToken/${userProfileId}?notificationToken=${notificationToken}&latitude=${location.latitude}&longitude=${location.longitude}`

        await axios.post(
          url,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      } else {
        console.error('Failed to get location.')
      }
    } catch (error) {
      console.error('Error updating notification token:', error)
    }
  }

  const handleLogout = () => {
    updateUserNotificationToken(loggedUser?.id, 'disconnected')
    setLoggedUser(null)
    setToken(null)
    AsyncStorage.removeItem('loggedUser')
    AsyncStorage.removeItem('token')
    showNotificationMessage('Logged out successfully ', 'success')
  }
  const refreshData = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/api/UserProfile/GetUserProfileByPhone/${loggedUser?.phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setLoggedUser(response.data)
      await AsyncStorage.setItem('loggedUser', JSON.stringify(response.data))
    } catch (error) {
      // console.error('Error fetching user profile:', error)
    }
  }

  const updateProfileImage = async (imageUri: any, userProfileId: number) => {
    try {
      const formData = new FormData()

      formData.append('userProfileId', userProfileId.toString())
      formData.append('imagefile', imageUri, 'image.jpg')

      const axiosResponse = await axios.post(
        `${config.BASE_URL}/api/UserProfile/UpdateUserImage/${userProfileId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (axiosResponse.status === 204) {
        showNotificationMessage('Image uploaded successfully', 'success')
      } else {
        showNotificationMessage('Failed to upload image', 'fail')
      }
    } catch (error) {
      showNotificationMessage('Error uploading image:', 'fail')
    }
  }
  useEffect(() => {
    if (loggedUser && token) {
      fetchFriendRequests()
    }
  }, [loggedUser, token])

  return (
    <UserContext.Provider
      value={{
        loggedUser,
        setLoggedUser,
        token,
        updateNotificationToken,
        setToken,
        handleLogin,
        handleLogout,
        updateProfileImage,
        refreshData,
        friendRequests,
        setFriendRequests,
        friendRequestsCount,
        fetchFriendRequests,
        fetchFriendCount,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
