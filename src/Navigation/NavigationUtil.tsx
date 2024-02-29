import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

export const useHandleNavigation = () => {
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (screenName: string, params?: object) => {
    navigation.navigate(screenName, params)
  }
}
