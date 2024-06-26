import React from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { ImageConfig } from '../../config/imageConfig'
import FooterNavbar from '../FooterNavbar'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'

interface Chat {
  id: number
  contact: string
  lastMessage: string
  imageUri: string
}

interface Props {
  chats: Chat[]
  onPressChat: (chatId: number) => void
}

const ChatList: React.FC<Props> = ({ chats, onPressChat }) => {
  const { backgroundColor, textColor } = useThemeColor()
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1, backgroundColor: backgroundColor }}
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressChat(item.id)}
            style={styles.chatItem}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Image
                  source={
                    item.imageUri !== ''
                      ? { uri: ImageConfig.IMAGE_CONFIG + item.imageUri }
                      : require('../../../assets/DefaultUserIcon.png')
                  }
                  style={styles.image}
                />
              </View>
              <View style={{ paddingTop: 4 }}>
                <Text style={[styles.contactName, { color: textColor }]}>
                  {item.contact}
                </Text>
                <Text style={[styles.lastMessage, { color: textColor }]}>
                  Last message: {item.id}
                  {item.id}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <FooterNavbar currentRoute={''} />
    </View>
  )
}

const styles = StyleSheet.create({
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 16,

    color: 'white',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
})

export default ChatList
