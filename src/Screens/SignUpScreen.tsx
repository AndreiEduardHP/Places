import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import SignUpForm from '../Components/SignUpFrom'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUpScreen: React.FC = () => {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ backgroundColor: 'black', flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View
                style={{
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    marginLeft: 30,

                    fontSize: 32,
                    color: 'white',
                  }}>
                  {t('signUpScreen.signUp')}
                </Text>
                <SignUpForm />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.container}>
              <LinearGradient
                colors={['rgba(0,0,0,0) ', 'rgba(255,255,255,0.51)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientRectangle}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0) ', 'rgba(255,255,255,0.51)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientRectangle}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0) ', 'rgba(255,255,255,0.51)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientRectangle}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  image: {
    width: 460,
    height: 410,
    bottom: 0,
    position: 'absolute',
  },
  container: {
    position: 'absolute',
    flexDirection: 'row', // Align children horizontally
    justifyContent: 'center', // Center the diamonds horizontally
    alignItems: 'center', // Center the diamonds vertically
    width: '100%',
    bottom: 25,
  },

  gradientRectangle: {
    // position: 'absolute',

    transform: [{ rotate: '46deg' }], // Rotate the rectangle
    borderRadius: 5,
    height: 102, // Assuming you want to fill from top to 70.71% of the container's height
    width: 102, // Adjust width based on left and right values or set explicitly
  },
})
export default SignUpScreen
