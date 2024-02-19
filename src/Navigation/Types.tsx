// src/types/navigationTypes.ts

export type RootStackParamList = {
  DefaultScreen: undefined
  LoginScreen: undefined
  SignUp: undefined
  AboutUs: undefined
  ProfileScreen: undefined
  MapScreen: undefined
  SettingScreen: undefined
  HomeScreen: SelectedPersonInfoData // Specify parameters expected by HomeScreen
  NewConnectionScreen: undefined
  FriendRequestScreen: undefined
  SelectedPersonInfo: SelectedPersonInfoData
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
