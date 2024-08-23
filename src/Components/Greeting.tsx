import { t } from 'i18next'
import React from 'react'
import { View, Text, TextStyle } from 'react-native'

type GreetingProps = {
  style?: TextStyle
}

const Greeting = ({ style }: GreetingProps) => {
  const currentDate = new Date()
  const currentHour = currentDate.getHours()

  let greetingMessage = ''

  if (currentHour >= 5 && currentHour < 12) {
    greetingMessage = t('greeting.goodMorning')
  } else if (currentHour >= 12 && currentHour < 17) {
    greetingMessage = t('greeting.goodAfternoon')
  } else {
    greetingMessage = t('greeting.goodEvening')
  }

  return (
    <View>
      <Text style={style}>{greetingMessage}, </Text>
    </View>
  )
}

export default Greeting
