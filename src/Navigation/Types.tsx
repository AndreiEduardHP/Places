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
  ChatRoom: ChatRoomProps
  SelectedPersonInfo: SelectedPersonInfoData
  JoinedEventsScreen: undefined
  ProfileVisibilityScreen: undefined
  Chat: { chatId: number }
}
export type ChatRoomProps = {
  selectedRoom: number
  contact: string
  imageUri: string
  firstName: string
  lastName: string
  description: string
  profilePicture: string
  friendRequestStatus: string
  areFriends: boolean
  username: string
  phoneNumber: string
  email: string
  interest: string
  city: string
  currentLocationId: number
  receiverId: number
  notificationToken: string
}
export type SelectedPersonInfoData = {
  personData?: {
    friendRequestStatus: string
    areFriends: boolean
    id: string
    firstName: string
    description: string
    receiverId: number
    lastName: string
    phoneNumber: string
    email: string
    interest: string
    profilePicture: string
    username: string
    city: string
    notificationToken: string
    currentLocationId: string
  }
}
