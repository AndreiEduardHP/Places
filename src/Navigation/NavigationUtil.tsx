// NavigationUtil.js
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

// Create a custom hook that returns the navigation function
export const useHandleNavigation = () => {
  const navigation = useNavigation<StackNavigationProp<any>>()

  // Extend the hook to accept parameters
  return (screenName: string, params?: object) => {
    navigation.navigate(screenName, params)
  }
}
