// src/types/navigationTypes.ts

export type RootStackParamList = {
  DefaultScreen: undefined
  LoginScreen: undefined
  SignUp: undefined
  AboutUs: undefined
  ProfileScreen: undefined
  MapScreen:
    | {
        latitude: number
        longitude: number
      }
    | undefined

  SettingScreen: undefined
  HomeScreen: SelectedPersonInfoData
  NewConnectionScreen: undefined
  FriendRequestScreen: undefined
  PaymentScreen: undefined
  EditUserProfileScreen: undefined
  AccountPreferenceScreen: undefined
  SupportScreen: undefined
  SelectedPersonInfo: SelectedPersonInfoData
  JoinedEventsScreen: undefined
  Chat: { chatId: number }
}

export type SelectedPersonInfoData = {
  personData?: {
    friendRequestStatus: string
    areFriends: boolean
    id: string
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    interest: string
    profilePicture: string
    username: string
    city: string
    currentLocationId: string
  }
}
