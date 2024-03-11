import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  Platform,
  PanResponder,
  KeyboardAvoidingView,
  ScrollView,
  KeyboardAvoidingViewComponent,
} from 'react-native'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'

// Define a type for the component props
interface BottomDrawerProps {
  children: React.ReactNode // Using React.ReactNode for children prop
  onClose: () => void // Function type for onClose prop
  visible: boolean // Prop to control the visibility of the drawer
  title: string
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  children,
  onClose,
  visible,
  title,
}) => {
  // Use useRef to persist the animated value without reinitializing on re-renders
  const translateY = useRef(new Animated.Value(0)).current
  const animatedHeight = useRef(new Animated.Value(0)).current
  const [currentHeight, setCurrentHeight] = useState(720)
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()

  useEffect(() => {
    if (visible) {
      animatedHeight.setValue(720)
      setCurrentHeight(720)
    }
    Animated.timing(translateY, {
      toValue: visible ? 0 : currentHeight,
      duration: 500,
      useNativeDriver: false,
    }).start()

    // Reset to initial height when drawer becomes visible
  }, [visible, translateY, animatedHeight])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {},
      onPanResponderRelease: (e, gestureState) => {
        let nextHeight = currentHeight

        // Allow dragging down to set height to 100
        if (gestureState.dy > 100 && currentHeight > 100) {
          nextHeight = 100
        }

        // Set initial height if drawer dragged up
        if (gestureState.dy < -100 && currentHeight < currentHeight) {
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
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
    },
    drawerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: 20,

      borderTopRightRadius: 20,
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 1,
          shadowRadius: 1,
        },
      }),
      // Make sure to adjust the container to accommodate the full drawer height
      //  height: 550, // Adjust this based on your drawer content
      overflow: 'hidden',
    },
    closeButton: {
      alignSelf: 'flex-end',
      padding: 16,
    },
    closeImage: {
      width: 26, // Adjust the width of the image as needed
      height: 26, // Adjust the height of the image as needed
      // Add any additional styles for the image
    },
    title: {
      marginLeft: 20,
      marginTop: 20,
      fontSize: 18,
    },
  })
  return (
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
          <Image
            style={styles.closeImage}
            source={require('../../assets/Icons/cancel.png')} // Replace with the path to your image
          />
        </TouchableOpacity>
      </View>
      {children}
    </Animated.View>
  )
}

export default BottomDrawer
