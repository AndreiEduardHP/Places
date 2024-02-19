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
  locationLatitude: number
  locationLongitude: number
  maxParticipants: number
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
