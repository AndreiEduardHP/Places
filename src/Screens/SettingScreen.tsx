import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import MapView, { Marker } from 'react-native-maps'
import EventForm from '../Components/EventForm'
import Chat from '../Components/Chat/Chat'
import LoadingComponent from '../Components/Loading/Loading'
import DarkMode from '../Components/SwitchDarkMode'
import RNPickerSelect from 'react-native-picker-select'

const SettingScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser, handleLogout } = useUser()

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{t('Settings')}</Text>
        <View style={styles.content}>
          {loggedUser ? (
            <>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.text}>Change theme:</Text>
                <DarkMode />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.text, {}]}>Change language:</Text>
                <RNPickerSelect
                  onValueChange={(value: any) => console.log(value)}
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
            </>
          ) : (
            <Text style={styles.noUserText}>{t('No user is logged in')}</Text>
          )}
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={'SettingScreen'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  text: {
    fontSize: 25,
    marginHorizontal: 20,
  },
  content: {
    //  flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dropdown: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default SettingScreen
