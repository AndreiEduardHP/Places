import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Select, Box, CheckIcon } from 'native-base'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import axios from 'axios'
import { useNotification } from '../Components/Notification/NotificationProvider'

const ProfileVisibilityScreen: React.FC = () => {
  const { t } = useTranslation()
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
      fontSize: 32,
      fontWeight: '300',
      marginHorizontal: 20,
      color: textColor,
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
      <Text style={styles.text}>Profile Visibility</Text>
      <Text style={{ color: textColor, marginLeft: 20, marginTop: 10 }}>
        {' '}
        You can set the Confidentiality status for your profile
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
              bg: 'teal.600',
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
