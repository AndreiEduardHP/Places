import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'

import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'
import PeopleCard from '../Components/PeopleCard'
import EventsAroundYou from '../Components/EventsAroundYou'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { Tab } from '@rneui/base'
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'

const LOCATION_TASK_NAME = 'background-location-task'

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  console.log('sdadasdas')
  if (error) {
    console.error('Location task error:', error)
    return
  }
  if (data) {
    const { locations } = data as any
    console.log('Received new locations in background', locations)
  }
})

const NewConnectionScreen: React.FC = () => {
  const { refreshData, loggedUser } = useUser()
  const { backgroundColor, textColor } = useThemeColor()
  const [index, setIndex] = useState(loggedUser?.role !== 'agency' ? 0 : 1)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    tabItem: {
      color: textColor,
    },
    footer: {
      justifyContent: 'flex-end',
    },
    titleDear: {
      marginTop: 5,
      marginLeft: 20,
      fontSize: 28,
      letterSpacing: 1.21,
      fontWeight: '300',
      fontFamily: '',
      color: textColor,
    },
    subTitle: {
      marginLeft: 10,
      fontSize: 18,
      letterSpacing: -1,
      fontWeight: '400',
      fontFamily: '',
    },
  })
  const startLocationUpdates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
      return
    }

    let backgroundStatus = await Location.requestBackgroundPermissionsAsync()
    if (backgroundStatus.status !== 'granted') {
      console.log('Permission to access location in background was denied')
      return
    }
    //  console.log(status + ' ' + backgroundStatus.status)
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 100,
      showsBackgroundLocationIndicator: true,

      deferredUpdatesInterval: 100,
    })
  }

  useEffect(() => {
    refreshData()
    console.log(loggedUser?.role)
    startLocationUpdates()
  }, [])
  const handleTabChange = (newIndex: number) => {
    setIndex(newIndex)
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {loggedUser?.role !== 'agency' && (
          <Tab
            value={index}
            indicatorStyle={{
              height: 2,
              width: '50%',
            }}
            onChange={handleTabChange}
            style={{ marginHorizontal: 10 }}>
            <Tab.Item titleStyle={styles.tabItem}>People</Tab.Item>
            <Tab.Item titleStyle={styles.tabItem}>Events</Tab.Item>
          </Tab>
        )}
        {index === 0 && (
          <View style={{ flex: 1 }}>
            <PeopleCard />
          </View>
        )}

        {index === 1 && <EventsAroundYou />}
      </View>

      <View style={styles.footer}>
        <FooterNavbar currentRoute={'NewConnectionScreen'} />
      </View>
    </View>
  )
}

export default NewConnectionScreen
