export interface UserData {
  imageUrl: string
  firstName: string
  lastName: string
  username: string
  phoneNumber: string
  email: string
  city: string
  interest: string
}

export interface EventData {
  eventName: string
  eventDescription: string
  eventImage: string
  eventTime: Date
  createdByUserId: number
  locationLatitude: number
  locationLongitude: number
  maxParticipants: number
  eventParticipantsCount: number
}

export interface Profile {
  id: number
  username: string
  email: string
  city: string
  interest: string
  firstName: string
  lastName: string
  phoneNumber: string
  profilePicture: string
}

export interface MapMarkerDetail {
  latitude: number
  longitude: number
  key: string
  eventDescription?: string
  eventName?: string
  eventImage?: string
  maxParticipants: number
  createdByUserId: number
  imageAlbumUrls?: string[]
}
export interface MapMarkerDetailConnection {
  requestId: number
  receiverId: number
  otherPersonId: number
  senderName: string
  requestDate: string
  senderPicture: string
  status: string
  latitude: number
  longitude: number
  profile: {
    id: number
    firstName: string
    lastName: string
    username: string
    phoneNumber: string
    email: string
    city: string
    interest: string
    country?: string
    shares: number
    emailVerified: boolean
    description: string
    notificationToken: string
    dateAccountCreation: string
    languagePreference?: string | null
    themeColor: string
    credit: number
    profileVisibility?: string
    profilePicture?: string
    currentLatitude: number
    currentLongitude: number
    userLocation?: string | null
    friends?: any
    sentFriendRequests?: any
    receivedFriendRequests?: any
  }
}

export interface MapMarker {
  latitude: number
  longitude: number
  key: string
}

export interface Person {
  friendRequestStatus: string
  areFriends: boolean
  id: string
  userName: string
  firstName: string
  lastName: string
  phoneNumber: string
  notificationToken: string
  email: string
  interest: string
  profilePicture: string
  username: string
  description: string
  city: string
  currentLatitude: number
  currentLongitude: number
  currentLocationId: string
}
export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  notificationToken: string
  profilePicture: string
  friendRequestStatus: string
  areFriends: boolean
  username: string
  description: string
  phoneNumber: string
  email: string
  interest: string
  city: string
  currentLocationId: number
}
