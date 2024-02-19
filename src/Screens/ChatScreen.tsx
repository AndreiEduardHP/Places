import { FlatList, View, Text } from 'react-native'

interface Message {
  id: number
  sender: string
  message: string
  timestamp: string
}

interface Props {
  messages: Message[]
}

const ChatScreen: React.FC<Props> = ({ messages }) => {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <View>
          <Text>{item.sender}</Text>
          <Text>{item.message}</Text>
          <Text>{item.timestamp}</Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

export default ChatScreen
