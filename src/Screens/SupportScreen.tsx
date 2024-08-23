import { t } from 'i18next'
import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import FooterNavbar from '../Components/FooterNavbar'
import SupportTicket from '../Components/SupportTicket'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import BackAction from '../Components/Back'

const SupportScreen: React.FC = () => {
  const { backgroundColor, textColor } = useThemeColor()
  const handleTicketSubmit = (ticket: {
    title: string
    description: string
  }) => {}
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
        <BackAction
          style={{
            width: 26,
            height: 26,
          }}></BackAction>
        <Text style={styles.text}>{t('supportScreen.supportSection')}</Text>
      </View>
      <ScrollView style={styles.container}>
        <SupportTicket onSubmit={handleTicketSubmit} />
      </ScrollView>
      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
}

export default SupportScreen
