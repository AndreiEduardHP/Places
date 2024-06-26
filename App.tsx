import * as React from 'react'
import 'react-native-gesture-handler'
import StackNavigator from './src/Navigation/StackNavigator'
import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Linking, Platform, StatusBar } from 'react-native'
import { useHandleNavigation } from './src/Navigation/NavigationUtil'
import { useNavigation } from '@react-navigation/native'
import MapScreen from './src/Screens/MapScreen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useUser } from './src/Context/AuthContext'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    })
    //console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token?.data
}

export default function App() {
  const { refreshData } = useUser()
  useEffect(() => {
    // Înregistrează pentru notificări
    registerForPushNotificationsAsync()

    // Handle notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data
      },
    )

    // Verifică dacă există notificări inițiale
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response && response.notification.request.content.data) {
        const data = response.notification.request.content.data
      }
    })

    return () => subscription.remove()
  }, [])

  return (
    <SafeAreaProvider>
      <StackNavigator />
    </SafeAreaProvider>
  )
}
