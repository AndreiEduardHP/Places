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

interface Profile {
  id: number
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
  languagePreference: string
  dateAccountCreation: string
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
  fetchFriendCount: (userId: number) => Promise<number>
}

export const UserContext = createContext<UserContextType>({
  loggedUser: null,
  setLoggedUser: () => {},
  token: null,
  setToken: () => {},
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
  const [loggedUser, setLoggedUser] = useState<Profile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [friendRequestsCount, setFriendRequestsCount] = useState<number>(0)
  const { showNotificationMessage } = useNotification()
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
  useEffect(() => {
    if (loggedUser && token) {
      fetchFriendRequests()
    }
  }, [loggedUser, token])

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
        const profileResponse = await axios.get(
          `${config.BASE_URL}/api/UserProfile/GetUserProfileByPhone/${phoneNumber}`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        )

        setLoggedUser(profileResponse.data)

        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + 3)
        await AsyncStorage.setItem(
          'loggedUser',
          JSON.stringify(profileResponse.data),
        )
        await AsyncStorage.setItem('token', newToken)
        await AsyncStorage.setItem(
          'tokenExpirationDate',
          expirationDate.toISOString(),
        )
        i18n.changeLanguage(loggedUser?.languagePreference)
        showNotificationMessage('Login authentication successful 👍', 'success')
      } else {
        console.error('Token is missing or undefined.')
      }
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  const handleLogout = () => {
    setLoggedUser(null)
    setToken(null)
    AsyncStorage.removeItem('loggedUser')
    AsyncStorage.removeItem('token')
    showNotificationMessage('Logged out successfully ', 'success')
  }
  const refreshData = () =>
    axios
      .get(
        `${config.BASE_URL}/api/UserProfile/GetUserProfileByPhone/${loggedUser?.phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        setLoggedUser(response.data)
        AsyncStorage.setItem('loggedUser', JSON.stringify(response.data))
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error)
      })

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

  return (
    <UserContext.Provider
      value={{
        loggedUser,
        setLoggedUser,
        token,
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
