import React, { createContext, useContext, useState, ReactNode } from 'react'
import Notification from '../Notification/Notifications'

interface NotificationContextType {
  showNotificationMessage: (
    message: string,
    type: 'success' | 'fail' | 'neutral',
  ) => void // Include type parameter
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notificationMessage, setNotificationMessage] = useState<{
    message: string
    type: 'success' | 'fail' | 'neutral'
  } | null>(null)

  const showNotificationMessage = (
    message: string,
    type: 'success' | 'fail' | 'neutral',
  ) => {
    setNotificationMessage({ message, type })
  }

  return (
    <NotificationContext.Provider value={{ showNotificationMessage }}>
      {children}
      {notificationMessage && (
        <Notification
          message={notificationMessage.message}
          type={notificationMessage.type}
          onClose={() => setNotificationMessage(null)}
        />
      )}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    )
  }
  return context
}
