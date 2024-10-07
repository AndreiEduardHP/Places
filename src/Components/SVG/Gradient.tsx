import React from 'react'
import Svg, { LinearGradient, Text, Defs, Stop, TSpan } from 'react-native-svg'

interface GradientStop {
  color: string
  offset: string
}

interface GradientTextProps {
  textLines: string[]
  fontSize?: number
  gradientStops: GradientStop[]
  svgStyle?: object
}

const GradientText: React.FC<GradientTextProps> = ({
  textLines,
  fontSize = 30,
  gradientStops,
  svgStyle,
}) => {
  const lineHeight = fontSize * 1.2
  const height = textLines.length * lineHeight
  const maxWidth =
    Math.max(...textLines.map((line) => line.length)) * fontSize * 0.6

  return (
    <Svg
      viewBox={`0 0 ${maxWidth} ${height}`}
      height={height}
      width={maxWidth}
      style={svgStyle}>
      <Defs>
        <LinearGradient
          id="rainbow"
          x1="0"
          x2="100%"
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse">
          {gradientStops.map((stop, index) => (
            <Stop key={index} stopColor={stop.color} offset={stop.offset} />
          ))}
        </LinearGradient>
      </Defs>
      <Text fill="url(#rainbow)">
        {textLines.map((line, index) => (
          <TSpan
            key={index}
            fontSize={fontSize}
            x="0"
            dy={index === 0 ? fontSize : lineHeight}>
            {line}
          </TSpan>
        ))}
      </Text>
    </Svg>
  )
}

export default GradientText
