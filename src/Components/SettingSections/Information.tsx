import React from 'react'
import { View, Text, StyleSheet, Share } from 'react-native'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LineComponent from '../LineComponent'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import { useUser } from '../../Context/AuthContext'
import { useNotification } from '../Notification/NotificationProvider'
import { t } from 'i18next'

const InformationSection: React.FC = () => {
  const { textColor, backgroundColorGrey } = useThemeColor()
  const { showNotificationMessage } = useNotification()
  const { loggedUser, refreshData } = useUser()
  const handleNavigation = useHandleNavigation()

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: backgroundColorGrey,
      borderRadius: 10,
      marginHorizontal: 10,
      marginTop: 10,
    },
    text: {
      color: textColor,
      marginLeft: 10,
      fontSize: 16,
    },
    content: {
      paddingHorizontal: 18,
      paddingVertical: 0,
      width: '100%',
    },
    textContent: {
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
  })

  const increaseSharesCount = async () => {
    try {
      await axios.post(
        `${config.BASE_URL}/api/userprofile/shares/${loggedUser?.id}`,
      )
      refreshData()
      showNotificationMessage('Link was sent succesfully', 'success')
    } catch (err) {
      showNotificationMessage('Something went wrong', 'fail')
    }
  }

  const shareLink = async () => {
    try {
      const result = await Share.share({
        title: 'Check this out!',
        message: 'Check out this cool app: ',
        url: 'https://www.places.com',
      })

      if (result.action === Share.sharedAction) {
        increaseSharesCount()
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
        <TouchableOpacity
          style={[styles.row, { paddingBottom: 10 }]}
          onPress={() => handleNavigation('SupportScreen')}>
          <Icon name="info" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('information.help')}</Text>
        </TouchableOpacity>
        <LineComponent></LineComponent>
        <TouchableOpacity
          onPress={shareLink}
          style={[
            styles.row,
            {
              paddingTop: 10,
            },
          ]}>
          <Icon name="favorite" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('information.tellAFriend')}</Text>
        </TouchableOpacity>
        <LineComponent></LineComponent>
        <TouchableOpacity
          onPress={() => handleNavigation('HomeScreen')}
          style={[
            styles.row,
            {
              paddingTop: 10,
            },
          ]}>
          <Icon name="business" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('information.aboutUs')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default InformationSection
