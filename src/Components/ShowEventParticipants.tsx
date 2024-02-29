import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

import { useHandleNavigation } from '../Navigation/NavigationUtil'
import { TouchableOpacity } from 'react-native'

interface Participant {
  id: string
  firstName: string
  lastName: string
  interest: string
  profilePicture: string
}

interface ParticipantsListProps {
  eventId: number
  participants: Participant[]
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  eventId,
  participants,
}) => {
  const navigate = useHandleNavigation()

  const renderItem = ({ item }: { item: Participant }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigate('SelectedPersonInfo', { personData: item })
        }}>
        <Text style={styles.participantName}>
          {item.firstName} {item.lastName}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={participants}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>No participants found.</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 700,
    minHeight: 150,
    backgroundColor: 'rgba(245,245,245,0.8)',
    borderRadius: 10,
    margin: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  participantName: {
    fontSize: 16,
  },
})

export default ParticipantsList
