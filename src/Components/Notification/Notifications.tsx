import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface NotificationProps {
  message: string
  type: 'success' | 'fail' | 'neutral'
  onClose: () => void
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const containerStyles = [
    styles.container,
    type === 'success'
      ? styles.successBackground
      : type === 'fail'
        ? styles.failBackground
        : styles.neutralBackground,
    styles.absolute,
  ]
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <View style={[containerStyles]}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '13%',
    left: 15,
    right: 15,
    zIndex: 999,
  },
  successBackground: {
    backgroundColor: 'rgba(90,190,63,0.9)',
  },
  failBackground: {
    backgroundColor: 'rgba(205,0,26,0.9)',
  },
  neutralBackground: {
    backgroundColor: 'rgba(57,61,71,0.9)',
  },
  message: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    shadowOffset: { width: 0.5, height: 0.2 },
    shadowColor: 'black',
    shadowOpacity: 1,
    paddingHorizontal: 20,
    shadowRadius: 2,
  },
  closeButton: {
    padding: 5,
  },
  absolute: {
    position: 'absolute',
  },
})

export default Notification
