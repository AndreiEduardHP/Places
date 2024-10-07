import React from 'react'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StyleProp, ViewStyle, StyleSheet } from 'react-native'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'

interface BackActionProps {
  style?: StyleProp<ViewStyle>
}

const BackAction: React.FC<BackActionProps> = ({ style }) => {
  const navigation = useNavigation()
  const { textColor } = useThemeColor()

  const back = () => {
    navigation.goBack()
  }

  return (
    <Appbar.BackAction
      onPress={back}
      style={StyleSheet.flatten([defaultStyles.backAction, style])}
      color={textColor}
    />
  )
}

const defaultStyles = StyleSheet.create({
  backAction: {
    width: 23, // Default width
    height: 23, // Default height
  },
})
export default BackAction
