import React from 'react'
import { Appbar } from 'react-native-paper'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StyleProp, ViewStyle } from 'react-native'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { ChatRouteParams } from './Chat/Chat'

interface BackActionProps {
  style?: StyleProp<ViewStyle>
}

const BackAction: React.FC<BackActionProps> = ({ style }) => {
  const navigation = useNavigation()
  const { textColor } = useThemeColor()

  const route = useRoute<RouteProp<{ params: ChatRouteParams }, 'params'>>()

  const back = () => {
    navigation.goBack()
  }

  return <Appbar.BackAction onPress={back} style={style} color={textColor} />
}

export default BackAction
