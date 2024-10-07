import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { t } from 'i18next'
import { useUser } from '../../Context/AuthContext'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import BackAction from '../Back'
import FriendRequestItem from './FriendRequestItem'
import FooterNavbar from '../FooterNavbar'

const FriendRequestScreen = () => {
  const { friendRequests } = useUser()

  const themeColors = useThemeColor()
  const { textColor } = useThemeColor()

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.backgroundColor }}>
      {friendRequests.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BackAction></BackAction>
            <Text
              style={{
                color: textColor,
                fontWeight: '300',
                fontSize: 28,
              }}>
              {t('labels.yourFriendRequests')}
            </Text>
          </View>
          <FlatList
            data={friendRequests}
            renderItem={({ item }) => (
              <FriendRequestItem
                item={item}
                backgroundColor={themeColors.backgroundColor}
                textColor={themeColors.textColor}
              />
            )}
            keyExtractor={(item) => item.requestId.toString()}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 50,
            alignItems: 'center',
            backgroundColor: themeColors.backgroundColor,
          }}>
          <Text style={[styles.noRequest, { color: themeColors.textColor }]}>
            {t('friendRequestScreen.noRequests')}
          </Text>
        </View>
      )}
      <FooterNavbar currentRoute={''}></FooterNavbar>
    </View>
  )
}

const styles = StyleSheet.create({
  noRequest: {
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -0.4,
  },
})

export default FriendRequestScreen
