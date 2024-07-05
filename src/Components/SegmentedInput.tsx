import React, { useState, useRef } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  TextInputKeyPressEventData,
  Text,
  NativeSyntheticEvent,
  Clipboard,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface SegmentedCodeInputProps {
  length: number
  onCodeFilled: (code: string) => void
  editable: boolean
}

const SegmentedCodeInput: React.FC<SegmentedCodeInputProps> = ({
  length,
  onCodeFilled,
  editable,
}) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''))
  const inputs = useRef<(TextInput | null)[]>([])

  const handleChange = (text: string, index: number) => {
    const newCode = [...code]
    newCode[index] = text
    setCode(newCode)

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }

    if (index === length - 1 && text) {
      onCodeFilled(newCode.join(''))
    }
  }

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
      inputs.current[index - 1]?.focus()
    }
  }
  const handlePress = () => {
    const presetCode = '493933'.split('')
    const newCode = presetCode.slice(0, length)
    setCode(newCode)
    newCode.forEach((digit, index) => {
      if (inputs.current[index]) {
        inputs.current[index]?.setNativeProps({ text: digit })
      }
    })
    onCodeFilled(newCode.join(''))
  }

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          style={styles.input}
          maxLength={1}
          editable={editable}
          ref={(ref) => (inputs.current[index] = ref)}
        />
      ))}
      <TouchableOpacity onPress={handlePress}>
        <Text>Press</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 50,
    height: 50,
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginRight: 10,
  },
})

export default SegmentedCodeInput
