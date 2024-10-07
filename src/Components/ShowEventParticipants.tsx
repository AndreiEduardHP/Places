import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import { useHandleNavigation } from '../Navigation/NavigationUtil'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useUser } from '../Context/AuthContext'
import { Title } from 'react-native-paper'
import { t } from 'i18next'
import { Skeleton } from '@rneui/base'

interface Participant {
  id: string
  firstName: string
  lastName: string
  interest: string
  description: string
  profilePicture: string
  friendRequestStatus: string
}

interface ParticipantsListProps {
  eventId: number
  participants: Participant[]
  onCloseModal: () => void
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  eventId,
  participants,
  onCloseModal,
}) => {
  const navigate = useHandleNavigation()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { loggedUser } = useUser()
  const [loading, setLoading] = useState(true)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const renderItem = ({ item }: { item: Participant }) => {
    const isExpanded = expandedId === item.id
    const participantInterests = item.interest
      .split(',')
      .map((interest) => interest.trim())

    return (
      <View style={styles.itemContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              navigate('SelectedPersonInfo', { personData: item })
              onCloseModal()
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {loading && (
                <Skeleton
                  animation="wave"
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50,
                    position: 'absolute',
                    zIndex: 1,
                  }}
                />
              )}
              <Image
                style={{ width: 45, height: 45, borderRadius: 50 }}
                source={
                  item.profilePicture
                    ? { uri: item.profilePicture }
                    : require('../../assets/DefaultUserIcon.png')
                }
                onLoadStart={() => {
                  setLoading(true)
                }}
                onLoadEnd={() => {
                  setLoading(false)
                }}
                resizeMode="cover"
              />
              <Title style={{ paddingLeft: 15 }}>
                {item.firstName} {item.lastName.charAt(0)}
              </Title>
            </View>
          </TouchableOpacity>
          <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={34}
            color="black"
            onPress={() => toggleExpand(item.id)}
          />
        </View>

        {isExpanded && (
          <View style={styles.expandedContainer}>
            <Title>{t('Description')}</Title>
            <Text style={{ fontWeight: '300', fontSize: 18 }}>
              {item.description && item.description != '-'
                ? item.description
                : 'No description'}
            </Text>

            <Title>{t('Interests')}</Title>
            <Text style={styles.participantDetails}>
              {participantInterests.map((interest, index) => {
                const isCommonInterest = loggedUser?.interest.includes(interest)
                return (
                  <Text
                    key={index}
                    style={
                      isCommonInterest ? styles.commonInterest : undefined
                    }>
                    {interest && interest != '-' ? interest : 'No interests'}
                    {index < participantInterests.length - 1 && ', '}
                  </Text>
                )
              })}
            </Text>
          </View>
        )}
      </View>
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
          <Text>{t('noParticipantsFound')}</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 700,
    minHeight: 150,
    backgroundColor: 'rgba(230,230,230,1)',
    borderRadius: 8,
    marginVertical: 5,
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expandedContainer: {
    marginTop: 10,
  },
  participantDetails: {
    color: 'black',
  },
  commonInterest: {
    fontWeight: 'bold',
    color: '#00B0EF',
  },
})

export default ParticipantsList
