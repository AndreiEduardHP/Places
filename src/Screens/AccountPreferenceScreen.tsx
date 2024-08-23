import { t } from 'i18next'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import AccountPreference from '../Components/SettingSections/AccountPreference'
import BackAction from '../Components/Back'

const AccountPreferenceScreen: React.FC = () => {
  const { backgroundColor, textColor } = useThemeColor()

  const styles = StyleSheet.create({
    containerScroll: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 28,
      fontWeight: '300',
      color: textColor,
    },
    content: {
      justifyContent: 'center',
      padding: 10,
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
  })
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BackAction style={{ width: 26, height: 26 }} />
        <Text style={styles.text}>
          {t('accountPreferenceScreen.accountPreference')}
        </Text>
      </View>
      <View style={styles.container}>
        <AccountPreference></AccountPreference>
      </View>
      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
}

export default AccountPreferenceScreen
