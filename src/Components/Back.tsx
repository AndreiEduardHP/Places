// BackAction.tsx
import React from 'react'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StyleProp, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface BackActionProps {
  style?: StyleProp<ViewStyle>
}

const BackAction: React.FC<BackActionProps> = ({ style }) => {
  const navigation = useNavigation()

  const back = () => {
    navigation.goBack()
  }

  return <Appbar.BackAction onPress={back} style={style} />
}

export default BackAction
