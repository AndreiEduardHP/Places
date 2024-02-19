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
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { StackNavigationProp } from '@react-navigation/stack'
import { ImagePickerResponse } from 'react-native-image-picker'
import { ImagePickerSuccessResult } from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNotification } from '../Components/Notification/NotificationProvider'

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
    // Default implementation or a placeholder function
    // For instance, you can log a message saying this function is not implemented yet
    console.warn('updateProfileImage function is not implemented')
  },
  friendRequests: [], // Empty array as the initial value
  setFriendRequests: () => {}, // Placeholder function
  friendRequestsCount: 0, // Initial value set to 0
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
  requestDate: string // Or Date if you convert the date string to a Date object
  // Add any other fields that your API returns
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
            // Token has expired, log the user out
            handleLogout()
          }
          const storedLoggedUser = await AsyncStorage.getItem('loggedUser')
          if (storedLoggedUser) {
            // Parse the JSON string into an object
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
      // Replace the URL with your actual endpoint that returns the friend count
      const response = await axios.get(
        `${config.BASE_URL}/api/Friend/count/${loggedUser?.id}`,
        {
          headers: {
            // If your API requires authentication, make sure to include the token in the request headers
          },
        },
      )
      return response.data // Assuming the API directly returns the count as a response
    } catch (error) {
      console.error('Error fetching friend count:', error)
      throw error // Consider how you want to handle errors - rethrowing here
    }
  }

  const fetchFriendRequests = async () => {
    if (loggedUser && token) {
      try {
        const response = await axios.get<FriendRequest[]>(
          `${config.BASE_URL}/api/Friend/pendingFriendRequests/${loggedUser.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        setFriendRequests(response.data)
        setFriendRequestsCount(response.data.length) // Assuming the API returns an array of requests
      } catch (error) {
        console.error('Failed to fetch friend requests:', error)
        // Optionally, handle error state
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
      setToken(newToken) // Update the token state

      if (newToken) {
        const profileResponse = await axios.get(
          `${config.BASE_URL}/api/UserProfile/GetUserProfileByPhone/${phoneNumber}`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        )

        setLoggedUser(profileResponse.data) // Set the user profile in context
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
    // Perform any other cleanup or state resets you need on logout
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
        // Assuming that `refreshData.response` is where you want to store the response data
        setLoggedUser(response.data)
        AsyncStorage.setItem('loggedUser', JSON.stringify(response.data))
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error('Error fetching user profile:', error)
      })

  const updateProfileImage = async (imageUri: any, userProfileId: number) => {
    try {
      const formData = new FormData()

      // Append the userProfileId as a field
      formData.append('userProfileId', userProfileId.toString())

      // Append the image file

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
        console.log('Image uploaded successfully')
      } else {
        console.log('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
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
