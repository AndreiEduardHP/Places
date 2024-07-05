// src/types/navigationTypes.ts

export type RootStackParamList = {
  DefaultScreen: undefined
  LoginScreen: undefined
  SignUp: undefined
  AboutUs: undefined
  MyAwardsScreen: undefined
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
  EventsCreatedByMe: undefined
  EditUserProfileScreen: undefined
  AccountPreferenceScreen: undefined
  SupportScreen: undefined
  SelectedPersonInfo: SelectedPersonInfoData
  JoinedEventsScreen: undefined
  ProfileVisibilityScreen: undefined
  Chat: { chatId: number }
}

export type SelectedPersonInfoData = {
  personData?: {
    friendRequestStatus: string
    areFriends: boolean
    id: string
    firstName: string
    receiverId: number
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
