import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useUser } from './AuthContext'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { useNotification } from '../Components/Notification/NotificationProvider'

const DarkModeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
})

interface DarkModeProviderProps {
  children: ReactNode
}

export const useDarkMode = () => useContext(DarkModeContext)

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const { loggedUser, refreshData } = useUser()
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const { showNotificationMessage } = useNotification()
  useEffect(() => {
    const themeColor = loggedUser?.themeColor
    setIsDarkMode(
      themeColor === 'dark' ? false : themeColor === 'light' ? true : false,
    )
  }, [loggedUser])

  const toggleDarkMode = async () => {
    const newIsDarkMode = !isDarkMode

    setIsDarkMode(newIsDarkMode)

    const apiUrl = `${config.BASE_URL}/api/UserProfilePreference/${loggedUser?.id}/preferences`

    const requestBody = {
      ThemeColor: newIsDarkMode ? 'light' : 'dark',
      Description: loggedUser?.description,
    }

    try {
      await axios.put(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      showNotificationMessage(
        'User preferences updated successfully',
        'success',
      )
      refreshData()
    } catch (error) {
      showNotificationMessage('Error updating user preferences:', 'fail')
      setIsDarkMode(!newIsDarkMode)
    }
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}
