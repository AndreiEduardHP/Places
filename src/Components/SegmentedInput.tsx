import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native'

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
  const [code, setCode] = useState<string>('')
  const [focusedIndex, setFocusedIndex] = useState<number>(0)
  const inputRef = useRef<TextInput | null>(null)
  const cursorOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const blink = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }
    blink()
  }, [cursorOpacity])

  const handleChange = (text: string) => {
    setCode(text)
    setFocusedIndex(text.length)
    if (text.length === length) {
      onCodeFilled(text)
    }
  }

  const renderCodeInputs = () => {
    const codeArray = code.split('')
    const inputs = []
    for (let i = 0; i < length; i++) {
      inputs.push(
        <View key={i} style={styles.inputContainer}>
          {codeArray[i] ? (
            <Text style={styles.inputText}>{codeArray[i]}</Text>
          ) : (
            focusedIndex === i && (
              <Animated.Text
                style={{ ...styles.inputText, opacity: cursorOpacity }}>
                |
              </Animated.Text>
            )
          )}
        </View>,
      )
    }
    return inputs
  }

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        style={styles.hiddenInput}
        maxLength={length}
        textContentType="oneTimeCode"
        editable={editable}
        autoFocus={true}
        onSelectionChange={(e) =>
          setFocusedIndex(e.nativeEvent.selection.start)
        }
      />
      <TouchableOpacity
        style={styles.inputsContainer}
        onPress={() => inputRef.current?.focus()}
        activeOpacity={1}>
        {renderCodeInputs()}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
  inputsContainer: {
    flexDirection: 'row',
  },
  inputContainer: {
    width: 50,
    height: 50,
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputText: {
    fontSize: 24,
    textAlign: 'center',
  },
})

export default SegmentedCodeInput
