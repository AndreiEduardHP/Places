import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet } from 'react-native'

import { useUser } from '../../Context/AuthContext'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LineComponent from '../LineComponent'
import DarkMode from '../SwitchDarkMode'
import { useNotification } from '../Notification/NotificationProvider'
import { config } from '../../config/urlConfig'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select'
import i18n from '../../TranslationFiles/i18n'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'

const AccountPreference: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, refreshData, handleLogout } = useUser()
  const { showNotificationMessage } = useNotification()
  const handleNavigation = useHandleNavigation()
  const { textColor, backgroundColorGrey } = useThemeColor()

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
    textExit: {
      color: 'rgba(245, 39, 39, 0.8)',
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
    dropdown: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: textColor,
      paddingRight: 30,
    },
  })

  const changeLanguagePicker = async (lng: string) => {
    const apiUrl = `${config.BASE_URL}/api/UserProfilePreference/${loggedUser?.id}/preferences`

    const requestBody = {
      LanguagePreference: lng,
    }

    try {
      const response = await axios.put(apiUrl, requestBody, {
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
    i18n.changeLanguage(lng)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={styles.row}>
            <Icon name="nights-stay" size={30} color={textColor}></Icon>
            <Text style={styles.text}>{t('accountPreference.darkMode')}</Text>
          </View>

          <DarkMode />
        </View>

        <LineComponent />

        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={styles.row}>
            <Icon name="g-translate" size={30} color={textColor}></Icon>
            <Text style={styles.text}>
              {t('accountPreference.changeLanguage')}
            </Text>
          </View>
          <View>
            <RNPickerSelect
              onValueChange={(value: any) => changeLanguagePicker(value)}
              items={[
                { label: 'English', value: 'en' },
                { label: 'Română', value: 'ro' },
              ]}
              style={{
                inputIOS: styles.dropdown,
                inputAndroid: styles.dropdown,
              }}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>
        <LineComponent />
        <TouchableOpacity
          onPress={() => handleNavigation('EditUserProfileScreen')}
          style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={styles.row}>
            <Icon name="edit" size={30} color={textColor}></Icon>
            <Text style={styles.text}>
              {t('accountPreference.editProfile')}
            </Text>
          </View>
        </TouchableOpacity>
        <LineComponent />
        <TouchableOpacity
          onPress={() => {
            handleLogout()
            handleNavigation('DefaultScreen')
          }}
          style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={styles.row}>
            <Icon name="logout" size={30} color={textColor}></Icon>
            <Text style={styles.textExit}>{t('buttons.logOut')}</Text>
          </View>
        </TouchableOpacity>
        <LineComponent />
        <TouchableOpacity
          onPress={() => {
            handleLogout()
            handleNavigation('DefaultScreen')
          }}
          style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={styles.row}>
            <Icon name="delete-forever" size={30} color={textColor}></Icon>
            <Text style={styles.textExit}>{t('buttons.deleteAccount')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AccountPreference
