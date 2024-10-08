import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LineComponent from '../LineComponent'
import { useHandleNavigation } from '../../Navigation/NavigationUtil'
import { t } from 'i18next'

const EventSection: React.FC = () => {
  const { textColor, backgroundColorGrey } = useThemeColor()
  const handleNavigation = useHandleNavigation()

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: backgroundColorGrey,
      borderRadius: 10,
      marginHorizontal: 10,
      marginTop: 10,
    },
    text: {
      color: textColor,
      marginLeft: 10,
      fontSize: 16,
    },
    content: {
      paddingHorizontal: 18,
      paddingVertical: 0,
      width: '100%',
    },
    textContent: {
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleNavigation('JoinedEventsScreen')}>
          <Icon name="event-available" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('eventSection.joinedEvents')}</Text>
        </TouchableOpacity>
        <LineComponent />
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleNavigation('EventsCreatedByMe')}>
          <Icon name="event-note" size={30} color={textColor}></Icon>
          <Text style={styles.text}>{t('eventSection.myEvents')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EventSection
