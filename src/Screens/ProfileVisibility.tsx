import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Select, Box, CheckIcon } from 'native-base'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import axios from 'axios'
import { useNotification } from '../Components/Notification/NotificationProvider'
import BackAction from '../Components/Back'
import { t } from 'i18next'

const ProfileVisibilityScreen: React.FC = () => {
  const { loggedUser, refreshData } = useUser()
  const { showNotificationMessage } = useNotification()
  const { backgroundColor, textColor } = useThemeColor()
  const [visibilityStatus, setVisibilityStatus] = useState(
    loggedUser?.profileVisibility || 'Visible to everyone',
  )

  const handleStatusChange = async (status: string) => {
    setVisibilityStatus(status)

    const apiUrl = `${config.BASE_URL}/api/UserProfilePreference/${loggedUser?.id}/preferences`
    const requestBody = {
      ProfileVisibility: status,
      Description: loggedUser?.description,
    }

    try {
      await axios.put(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      showNotificationMessage(
        'User preferences updated successfully',
        'success',
      )
      refreshData()
    } catch (error) {
      showNotificationMessage('Error updating user preferences:', 'fail')
    }
  }

  const styles = StyleSheet.create({
    containerScroll: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 22,

      color: textColor,
      letterSpacing: -0.6,
      fontWeight: '300',
    },
    content: {
      justifyContent: 'center',
      padding: 10,
    },
    header: {
      fontSize: 28,
      fontWeight: '400',
      margin: 20,
      color: textColor,
    },
    logoutButton: {
      marginTop: 20,
      color: 'blue',
      textDecorationLine: 'underline',
    },
    noUserText: {
      fontSize: 16,
      color: 'red',
    },
    footer: {
      padding: 10,
      justifyContent: 'flex-end',
    },
    dropdown: {
      margin: 20,
    },
  })

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BackAction></BackAction>

        <Text style={styles.text}>{t('labels.profileVisibility')}</Text>
      </View>
      <Text style={{ color: textColor, marginLeft: 20, marginTop: 10 }}>
        {' '}
        {t('labels.profileVisibilitySubTitle')}
      </Text>
      <View style={{ flex: 1 }}>
        <Box w="90%" alignSelf="center" style={styles.dropdown}>
          <Select
            selectedValue={visibilityStatus}
            minWidth="200"
            color={textColor}
            accessibilityLabel="Choose Visibility"
            placeholder="Choose Visibility"
            _selectedItem={{
              bg: '#00B0EF',
              borderRadius: 10,
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => handleStatusChange(itemValue)}>
            <Select.Item
              color={'white'}
              label="Visible to everyone"
              value="Visible to everyone"
            />
            <Select.Item
              color={'white'}
              label="Visible to peers"
              value="Visible to peers"
            />
            <Select.Item color={'white'} label="Private" value="Private" />
          </Select>
        </Box>
      </View>
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

export default ProfileVisibilityScreen
