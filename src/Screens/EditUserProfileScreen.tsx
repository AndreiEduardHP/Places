import { t } from 'i18next'
import React from 'react'

import { View, Text, StyleSheet } from 'react-native'

import FooterNavbar from '../Components/FooterNavbar'
import UserProfileForm from '../Components/UpdateUser'

const EditUserProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
        }}>
        <Text style={styles.text}>Edit User Profile</Text>
      </View>

      <UserProfileForm />
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  text: {
    fontSize: 27,
    color: 'white',
  },
})

export default EditUserProfileScreen
