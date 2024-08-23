import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import axios from 'axios'
import { config } from '../../config/urlConfig'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { t } from 'i18next'

interface Event {
  id: number
  eventName: string
  eventDescription: string
  locationLatitude: number
  locationLongitude: number
  maxParticipants: number
  createdByUserId: number
  eventImage: string
  otherRelevantInformation: any
}
const SearchEvent: React.FC<{
  onEventSelect: (event: Event) => void
  focusInput: boolean
}> = ({ onEventSelect, focusInput }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [events, setEvents] = useState<Event[]>([])

  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (focusInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focusInput])

  useEffect(() => {
    if (searchTerm.length >= 1) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(
            `${config.BASE_URL}/api/Event/search`,
            {
              params: { query: searchTerm },
            },
          )
          setEvents(response.data)
        } catch (error) {
          console.error('Error fetching events:', error)
        }
      }
      fetchEvents()
    } else {
      setEvents([])
    }
  }, [searchTerm])

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={t('eventsAroundYou.searchPlaceholder')}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            style={styles.clearIcon}
            onPress={() => setSearchTerm('')}>
            <Icon name="close" size={20} color="#555" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => onEventSelect(item)}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text style={styles.eventDescription}>{item.eventDescription}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 8,
  },
  searchInput: {
    flex: 1,
  },
  clearIcon: {
    marginLeft: 10,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  eventName: {
    fontWeight: 'bold',
  },
  eventDescription: {
    color: '#555',
  },
})

export default SearchEvent
