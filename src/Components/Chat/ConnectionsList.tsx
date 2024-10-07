import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native'
import FooterNavbar from '../FooterNavbar'
import { Avatar, Card, Button } from 'react-native-paper'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useUser } from '../../Context/AuthContext'
import { formatDateAndTime } from '../../Utils.tsx/Services/FormatDate'
import BackAction from '../Back'
import { t } from 'i18next'
import { config } from '../../config/urlConfig'
import axios from 'axios'
import {
  acceptFriendRequest,
  declineFriendRequest,
  unfriendUser,
} from '../../Services/FriendService'
import { useNotification } from '../Notification/NotificationProvider'
import { fetchLocationDetails } from '../../Services/LocationDetails'
import MapView, { Marker } from 'react-native-maps'
import LoadingComponent from '../Loading/Loading'
import { SearchBar } from '@rneui/base'

const ConnectionsList: React.FC = () => {
  const { backgroundColor, textColor, backgroundColorGrey } = useThemeColor()
  const { loggedUser } = useUser()
  const [data, setData] = useState<any>(null)
  const [filteredData, setFilteredData] = useState<any>(null)
  const [search, setSearch] = useState<string>('')
  const [locationData, setLocationData] = useState<any>({})
  const { showNotificationMessage } = useNotification()
  const [isLoading, setIsLoading] = useState(true)

  const fetchFriendRequests = async () => {
    if (loggedUser) {
      try {
        const response = await axios.get(
          `${config.BASE_URL}/api/Friend/acceptedFriendRequests/${loggedUser.id}`,
        )
        setData(response.data)
        setFilteredData(response.data)
        const locations: { [key: string]: any } = {}
        for (let item of response.data) {
          const address = await fetchLocationDetails(
            item.latitude,
            item.longitude,
          )
          locations[item.requestId] = {
            address,
            latitude: item.latitude,
            longitude: item.longitude,
          }
        }
        setLocationData(locations)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch friend requests:', error)
      }
    }
  }

  useEffect(() => {
    fetchFriendRequests()
  }, [])

  const handleSearch = (text: string) => {
    setSearch(text)

    if (text) {
      const filtered = data.filter(
        (item: any) =>
          item.senderName.toLowerCase().includes(text.toLowerCase()) ||
          item.status.toLowerCase().includes(text.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData(data)
    }
  }
  const handleAcceptFriend = async (requestId: number) => {
    const result = await acceptFriendRequest(requestId)
    showNotificationMessage(
      result?.message ? result.message : 'error',
      result?.success ? result.success : 'fail',
    )
    fetchFriendRequests()
  }

  const handleDeclineFriend = async (requestId: number) => {
    const result = await declineFriendRequest(requestId)
    showNotificationMessage(
      result?.message ? result.message : 'error',
      result?.success ? result.success : 'fail',
    )
    fetchFriendRequests()
  }

  const handleUnfriend = async (userId1: any, userId2: any) => {
    const result = await unfriendUser(userId1, userId2)
    showNotificationMessage(
      result?.message ? result.message : 'error',
      result?.success ? result.success : 'fail',
    )
    fetchFriendRequests()
  }

  if (isLoading) return <LoadingComponent></LoadingComponent>
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        {/*   <View style={styles.headerContainer}>
          <BackAction style={styles.backAction} />
          <Text style={[styles.headerText, { color: textColor }]}>
            {t('labels.yourConnections')}
          </Text>
        </View> */}

        <View style={styles.searchContainer}>
          <SearchBar
            placeholder={t('Search by name or status')}
            onChangeText={handleSearch}
            value={search}
            lightTheme // Use light theme, can be removed if dark theme is needed
            placeholderTextColor={textColor}
            containerStyle={{
              backgroundColor: 'transparent',
              paddingVertical: 5,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            inputStyle={{ color: textColor }} // Text color inside the input
            inputContainerStyle={{
              backgroundColor:
                textColor == 'white'
                  ? 'rgba(35,35,35,1)'
                  : 'rgba(225,225,225,1)', // Background color of the input field
              borderRadius: 5, // Border radius for the input field
              height: 34,
            }}
          />
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 10 }}>
            {filteredData?.map((item: any, index: number) => (
              <Card
                key={item.requestId}
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      textColor == 'white'
                        ? 'rgba(48, 51, 55,1)'
                        : 'rgba(252,252,255,1)',
                    marginBottom: index === filteredData.length - 1 ? 40 : 10,
                  },
                ]}>
                <Card.Title
                  title={item.senderName}
                  subtitle={formatDateAndTime(new Date(item.requestDate))}
                  right={() => (
                    <Avatar.Image
                      style={{ marginHorizontal: 15 }}
                      size={55}
                      source={
                        item.senderPicture !== ''
                          ? { uri: item.senderPicture }
                          : require('../../../assets/DefaultUserIcon.png')
                      }
                    />
                  )}
                  titleStyle={{ color: textColor }}
                  subtitleStyle={{ color: textColor }}
                />
                <Card.Content>
                  <Text style={[styles.cardText, { color: textColor }]}>
                    {t('Connection location')}:{' '}
                    {locationData[item.requestId]
                      ? locationData[item.requestId].address
                      : 'Loading...'}
                  </Text>
                  <Text style={[styles.cardText, { color: textColor }]}>
                    {t('Status')}: {item.status}
                  </Text>
                  {locationData[item.requestId] && (
                    <MapView
                      style={styles.map}
                      region={{
                        latitude: locationData[item.requestId].latitude,
                        longitude: locationData[item.requestId].longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      scrollEnabled={false} // Dezactivează posibilitatea de a defila harta
                      zoomEnabled={false} // Dezactivează posibilitatea de a face zoom
                      rotateEnabled={false} // Dezactivează posibilitatea de a roti harta
                      pitchEnabled={false} //
                    >
                      <Marker
                        coordinate={{
                          latitude: locationData[item.requestId].latitude,
                          longitude: locationData[item.requestId].longitude,
                        }}
                        title={item.senderName}
                        description={locationData[item.requestId].address}
                      />
                    </MapView>
                  )}
                </Card.Content>
                <Card.Actions>
                  {item.status === 'Accepted' ? (
                    <Button
                      mode="contained"
                      buttonColor="#ff4d4d"
                      style={{
                        borderRadius: 4,
                        width: 150,
                        marginHorizontal: 10,
                      }}
                      onPress={() =>
                        handleUnfriend(loggedUser?.id, item.otherPersonId)
                      }>
                      {t('Unfriend')}
                    </Button>
                  ) : (item.receiverId === loggedUser?.id ||
                      item.senderId === loggedUser?.id) &&
                    item.status === 'Pending' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Button
                        mode="contained"
                        buttonColor="#00B0EF"
                        style={{
                          borderRadius: 4,
                          width: 150,
                          marginHorizontal: 10,
                        }}
                        onPress={() => handleAcceptFriend(item.requestId)}>
                        {t('Accept friend')}
                      </Button>
                      <Button
                        mode="contained"
                        buttonColor="red"
                        style={{
                          borderRadius: 4,
                          width: 150,
                          marginHorizontal: 10,
                        }}
                        onPress={() => handleDeclineFriend(item.requestId)}>
                        {t('Decline request')}
                      </Button>
                    </View>
                  ) : (
                    <Button
                      mode="contained"
                      style={{
                        backgroundColor: '#00B0EF',
                        opacity: 0.85,
                        borderRadius: 4,
                        width: 150,
                        marginHorizontal: 10,
                      }} // Apply custom styles here
                      labelStyle={{ color: '#FFFFFF' }} // Ensures the text color remains visible
                      disabled={true}>
                      {item.status}
                    </Button>
                  )}
                </Card.Actions>
              </Card>
            ))}
          </View>
        </ScrollView>
        <FooterNavbar currentRoute={'Chat'} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchContainer: {
    // paddingHorizontal: 101,
    // paddingTop: 9,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 9,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 8,
  },
  map: {
    height: 150,
    marginVertical: 10,
    borderRadius: 8,
  },

  headerText: {
    fontSize: 28,
    fontWeight: '300',
  },
})

export default ConnectionsList
