import React from 'react'
import { View, ViewStyle } from 'react-native'
import { useUser } from '../Context/AuthContext'

interface LineComponentProps {
  color?: string
  height?: number
}

const LineComponent: React.FC<LineComponentProps> = ({
  height = 0.8,
  color,
}) => {
  const { loggedUser } = useUser()

  const finalColor =
    color ||
    (loggedUser?.themeColor === 'dark'
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(5,5,5,0.2)')

  const lineStyle: ViewStyle = {
    backgroundColor: finalColor,
    height: height,
  }

  return <View style={lineStyle} />
}

export default LineComponent
