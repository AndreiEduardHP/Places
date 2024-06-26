import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { StyleProp, ViewStyle } from 'react-native'

interface CustomSvgComponentProps {
  width: string | number
  height: string | number
  style: StyleProp<ViewStyle>
  path: string
  stroke: string
  strokeWidth: string
}

const CustomSvgComponent: React.FC<CustomSvgComponentProps> = ({
  width = '100%',
  height = '100%',
  style,
  path,
  stroke,
  strokeWidth,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 829 631"
    fill="none"
    style={style}>
    <Path d={path} stroke={stroke} strokeWidth={strokeWidth} />
  </Svg>
)

export default CustomSvgComponent
