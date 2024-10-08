import React, { useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useUser } from '../../Context/AuthContext'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LineComponent from '../LineComponent'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import { t } from 'i18next'
import { useFocusEffect } from '@react-navigation/native'

const AccountSection: React.FC = () => {
  const handleNavigation = useHandleNavigation()
  const { friendRequestsCount, fetchFriendRequests, loggedUser } = useUser()

  useFocusEffect(
    useCallback(() => {
      fetchFriendRequests()
    }, []),
  )

  const { textColor, backgroundColorGrey } = useThemeColor()

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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleNavigation('AccountPreferenceScreen')}>
          <Icon name="manage-accounts" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('accountSettings.account')}</Text>
        </TouchableOpacity>
        <LineComponent />

        <TouchableOpacity
          style={styles.row}
          onPress={() => handleNavigation('ProfileVisibilityScreen')}>
          <Icon name="privacy-tip" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('accountSettings.privacy')}</Text>
        </TouchableOpacity>
        {loggedUser?.role !== 'agency' && <LineComponent />}

        {loggedUser?.role !== 'agency' && (
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleNavigation('Chat')}>
            <Icon name="manage-accounts" size={30} color={textColor}></Icon>
            <Text style={styles.text}>{t('accountSettings.chats')}</Text>
          </TouchableOpacity>
        )}
        <LineComponent />
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleNavigation('FriendRequestScreen')}>
          <Icon name="notifications-active" size={30} color={textColor}></Icon>
          <Text style={styles.text}>
            {t('accountSettings.notifications')} {friendRequestsCount}
          </Text>
        </TouchableOpacity>

        <LineComponent />
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleNavigation('PaymentScreen')}>
          <Icon name="payment" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('accountSettings.payments')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AccountSection
