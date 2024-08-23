import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import DefaultScreen from '../Screens/DefaultScreen'
import LoginScreen from '../Screens/LoginScreen'
import SignUpScreen from '../Screens/SignUpScreen'
import { NavigationContainer } from '@react-navigation/native'
import { DarkModeProvider } from '../Context/DarkModeContext'
import Navbar from '../Components/Navbar'
import ProfileScreen from '../Screens/ProfileScreen'
import MapScreen from '../Screens/MapScreen'
import SettingScreen from '../Screens/SettingScreen'
import HomeScreen from '../Screens/HomeScreen'
import NewConnectionScreen from '../Screens/NewConnectionScreen'
import { RootStackParamList } from './Types'
import SelectedPersonInfo from '../Screens/SelectedPersonInfo'
import { NotificationProvider } from '../Components/Notification/NotificationProvider'
import { UserProvider, useUser } from '../Context/AuthContext'
import Chat from '../Components/Chat/Chat'
import PaymentScreen from '../Screens/PaymentScreen'
import EditUserProfileScreen from '../Screens/EditUserProfileScreen'
import AccountPreferenceScreen from '../Screens/AccountPreferenceScreen'
import SupportScreen from '../Screens/SupportScreen'
import JoinedEventsScreen from '../Screens/MyEvents'
import EventsCreatedByMe from '../Screens/EventsCreatedByMe'
import MyAwardsScreen from '../Screens/MyAwardsScreen'
import ProfileVisibilityScreen from '../Screens/ProfileVisibility'
import ChatRoom from '../Components/Chat/ChatRoom'
import FriendRequestScreen from '../Components/Friends/FriendRequestScreen'

const Stack = createStackNavigator<RootStackParamList>()

const StackNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <NotificationProvider>
        <UserProvider>
          <DarkModeProvider>
            <Navbar title="Places" />
            <Stack.Navigator initialRouteName="NewConnectionScreen">
              <Stack.Screen
                name="DefaultScreen"
                component={DefaultScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="JoinedEventsScreen"
                component={JoinedEventsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProfileVisibilityScreen"
                component={ProfileVisibilityScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EventsCreatedByMe"
                component={EventsCreatedByMe}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SupportScreen"
                component={SupportScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AccountPreferenceScreen"
                component={AccountPreferenceScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SelectedPersonInfo"
                component={SelectedPersonInfo}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Chat"
                component={Chat}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditUserProfileScreen"
                component={EditUserProfileScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MyAwardsScreen"
                component={MyAwardsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PaymentScreen"
                component={PaymentScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NewConnectionScreen"
                component={NewConnectionScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="FriendRequestScreen"
                component={FriendRequestScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChatRoom"
                component={ChatRoom}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </DarkModeProvider>
        </UserProvider>
      </NotificationProvider>
    </NavigationContainer>
  )
}

export default StackNavigator
