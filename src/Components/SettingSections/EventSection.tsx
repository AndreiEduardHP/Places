import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Share,
} from 'react-native'

import { useUser } from '../../Context/AuthContext'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import UserProfilePicture from '../UserProfilePicture'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LineComponent from '../LineComponent'

const EventSection: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, refreshData } = useUser()
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: backgroundColorGrey,
      borderRadius: 10,
      marginHorizontal: 10,
      marginTop: 15,
    },
    text: {
      color: textColor,
      marginLeft: 10,
      fontSize: 16,
    },
    content: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      width: '100%',
    },
    textContent: {
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
  })

  const shareLink = async () => {
    try {
      const result = await Share.share({
        title: 'Check this out!',
        message: 'Check out this cool app: ',
        url: 'https://www.places.com',
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert('error')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.row}>
          <Icon name="event-available" size={30} color={textColor}></Icon>
          <Text style={styles.text}>Joined Events</Text>
        </TouchableOpacity>
        <LineComponent />
        <TouchableOpacity style={styles.row}>
          <Icon name="event-available" size={30} color={textColor}></Icon>
          <Text style={styles.text}>Joined Events</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EventSection
