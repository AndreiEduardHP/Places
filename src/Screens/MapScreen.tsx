import { t } from 'i18next'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import CustomeMap from '../Components/MapRelated/Map'

const MapScreen: React.FC = () => {
  const { loggedUser } = useUser()

  return (
    <View style={styles.container}>
      {loggedUser ? <CustomeMap /> : <Text>{t('noUserIsLoggedIn')}</Text>}
      <View
        style={{ zIndex: 1, position: 'absolute', bottom: 0, width: '100%' }}>
        <FooterNavbar currentRoute={'MapScreen'} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default MapScreen
