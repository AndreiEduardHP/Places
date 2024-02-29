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
}
export interface MapMarker {
  latitude: number
  longitude: number
  key: string
}
