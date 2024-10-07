// src/Services/FriendService.ts

import axios from 'axios'
import { config } from '../config/urlConfig'
type ResultType = 'success' | 'fail' | 'neutral'
export const acceptFriendRequest = async (requestId: number) => {
  try {
    const response = await axios.post(
      `${config.BASE_URL}/api/Friend/acceptFriendRequest/${requestId}`,
    )
    if (response.status === 200) {
      return {
        success: 'success' as ResultType,
        message: 'Friend request accepted.',
      }
    }
  } catch (error) {
    console.error('Error accepting friend request:', error)
    return {
      success: 'fail' as ResultType,
      message: 'Failed to accept friend request.',
    }
  }
}

export const declineFriendRequest = async (requestId: number) => {
  try {
    const response = await axios.post(
      `${config.BASE_URL}/api/Friend/declineFriendRequest/${requestId}`,
    )
    if (response.status === 200) {
      return {
        success: 'success' as ResultType,
        message: 'Friend request declined.',
      }
    }
  } catch (error) {
    console.error('Error declining friend request:', error)
    return {
      success: 'fail' as ResultType,
      message: 'Failed to decline friend request.',
    }
  }
}

export const unfriendUser = async (userId1: any, userId2: any) => {
  try {
    const response = await axios.delete(
      `${config.BASE_URL}/api/friend/${userId1}/${userId2}`,
    )
    if (response.status === 204) {
      return {
        success: 'success' as ResultType,
        message: 'Friend removed successfully',
      }
    }
  } catch (error) {
    console.error('Error deleting friend:', error)
    return { success: 'fail' as ResultType, message: 'Failed to remove friend' }
  }
}
