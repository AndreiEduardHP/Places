import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LineComponent from '../LineComponent'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

interface ProfileDetailsProps {
  data: { icon: string; label: string; value: string | number | undefined }[]
  showIcon?: boolean
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ data, showIcon }) => {
  const { textColor, backgroundColorGrey } = useThemeColor()
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: backgroundColorGrey,
      borderRadius: 10,
      marginHorizontal: 10,
      marginTop: 15,
    },
    text: {
      color: textColor,
      marginLeft: 10,
      fontSize: 16,
    },
    content: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <View style={styles.row}>
              <Icon name={item.icon} size={30} color={textColor} />
              <Text style={styles.text}>{`${item.label}: ${item.value}`}</Text>
              {showIcon && (
                <View style={{ marginLeft: 'auto' }}>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>
              )}
            </View>
            {index < data.length - 1 && <LineComponent />}
          </React.Fragment>
        ))}
      </View>
    </View>
  )
}

export default ProfileDetails
