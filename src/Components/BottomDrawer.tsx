import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  PanResponder,
  Dimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { StatusBar } from 'react-native'
import { Text } from '@rneui/themed'

interface BottomDrawerProps {
  children: React.ReactNode
  onClose: () => void
  visible: boolean
  title: string
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  children,
  onClose,
  visible,
  title,
}) => {
  const translateY = useRef(new Animated.Value(0)).current
  const animatedHeight = useRef(new Animated.Value(0)).current
  const screenHeight = Dimensions.get('window').height
  const statusBarHeight =
    Platform.OS === 'android' && StatusBar.currentHeight
      ? StatusBar.currentHeight
      : 40
  const usableScreenHeight = screenHeight - statusBarHeight
  const [currentHeight, setCurrentHeight] = useState(usableScreenHeight)

  useEffect(() => {
    if (visible) {
      animatedHeight.setValue(usableScreenHeight)
      setCurrentHeight(usableScreenHeight)
    }
    Animated.timing(translateY, {
      toValue: visible ? (Platform.OS === 'android' ? 20 : 50) : currentHeight,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [visible, translateY, animatedHeight])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {},
      onPanResponderRelease: (e, gestureState) => {
        let nextHeight = currentHeight

        if (gestureState.dy > 100 && currentHeight > 100) {
          nextHeight = 201
        }

        if (gestureState.dy < -100 && currentHeight) {
          nextHeight = currentHeight
        }

        Animated.timing(animatedHeight, {
          toValue: nextHeight,
          duration: 400,
          useNativeDriver: false,
        }).start()

        setCurrentHeight(nextHeight)
      },
    }),
  ).current

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 29,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      paddingVertical: 10,
      alignItems: 'center',
    },
    drawerContainer: {
      ...Platform.select({ ios: { position: 'absolute' } }),

      zIndex: 2222,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: 20,

      borderTopRightRadius: 20,
      ...Platform.select({
        ios: {},
      }),
    },
    closeButton: {
      alignSelf: 'flex-end',
      paddingHorizontal: 16,
    },
    closeImage: {
      width: 26,
      height: 26,
    },
    title: {
      marginLeft: 20,
      fontSize: 18,
      fontWeight: '500',
    },
  })
  return (
    visible && (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.drawerContainer,
          {
            transform: [{ translateY }],
            height: animatedHeight,
          },
        ]}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon size={30} name="highlight-off" />
          </TouchableOpacity>
        </View>
        {children}
      </Animated.View>
    )
  )
}

export default BottomDrawer
