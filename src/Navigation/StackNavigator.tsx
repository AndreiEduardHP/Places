import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import DefaultScreen from '../Screens/DefaultScreen'
import LoginScreen from '../Screens/LoginScreen'
import SignUpScreen from '../Screens/SignUpScreen'
import AboutUsScreen from '../Screens/AboutUsScreen'
import { NavigationContainer } from '@react-navigation/native'
import { DarkModeProvider } from '../Context/DarkModeContext'
import { StatusBar } from 'react-native'
import Navbar from '../Components/Navbar'
import ProfileScreen from '../Screens/ProfileScreen'
import MapScreen from '../Screens/MapScreen'
import SettingScreen from '../Screens/SettingScreen'
import HomeScreen from '../Screens/HomeScreen'
import NewConnectionScreen from '../Screens/NewConnectionScreen'
import { SafeAreaView } from 'react-native'
import FriendRequestScreen from '../Screens/FriendRequestScreen'
import { RootStackParamList } from './Types'
import SelectedPersonInfo from '../Screens/SelectedPersonInfo'
import { NotificationProvider } from '../Components/Notification/NotificationProvider'
import { UserProvider } from '../Context/AuthContext'
import Chat from '../Components/Chat/Chat'
import PaymentScreen from '../Screens/PaymentScreen'
import EditUserProfileScreen from '../Screens/EditUserProfileScreen'
import AccountPreferenceScreen from '../Screens/AccountPreferenceScreen'
import SupportScreen from '../Screens/SupportScreen'
import JoinedEventsScreen from '../Screens/MyEvents'

const Stack = createStackNavigator<RootStackParamList>()

const StackNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <NotificationProvider>
        <UserProvider>
          <DarkModeProvider>
            <SafeAreaView
              style={{
                flex: 1,
                marginTop: StatusBar.currentHeight,
                backgroundColor: 'black',
              }}>
              <Navbar title="Places" />
              <Stack.Navigator initialRouteName="DefaultScreen">
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
                  name="AboutUs"
                  component={AboutUsScreen}
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
              </Stack.Navigator>
            </SafeAreaView>
          </DarkModeProvider>
        </UserProvider>
      </NotificationProvider>
    </NavigationContainer>
  )
}

export default StackNavigator
