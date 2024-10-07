export interface IChat {
  notificationToken: any
  chatId: any
  id: number
  contact: string
  imageUri: string
  firstName: string
  lastName: string
  receiverId: number
  profilePicture: string
  friendRequestStatus: string
  areFriends: boolean
  username: string
  phoneNumber: string
  email: string
  interest: string
  description: string
  city: string
  currentLocationId: number
  unreadMessagesCount: number
}
export interface Message {
  id: number
  text: string
  senderId: number
  chatId: number
  timestamp: string
  dateSeparator?: boolean
}
