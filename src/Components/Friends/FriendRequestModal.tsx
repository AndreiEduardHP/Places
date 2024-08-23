import React from 'react'
import { Modal, View, Text, StyleSheet, FlatList } from 'react-native'
import FriendRequestItem from './FriendRequestItem'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useUser } from '../../Context/AuthContext'
import { Button } from '@rneui/base'
import Logo from '../SVG/Logo'

type FriendRequestModalProps = {
  visible: boolean
  onClose: () => void
}

const FriendRequestModal: React.FC<FriendRequestModalProps> = ({
  visible,
  onClose,
}) => {
  const { friendRequests } = useUser()
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: 'white' }]}>
          <Logo color="#040707" width="100"></Logo>
          <Text
            style={[
              styles.modalText,
              {
                color: 'black',
              },
            ]}>
            Friend Request
          </Text>

          <FlatList
            data={friendRequests}
            renderItem={({ item }) => (
              <FriendRequestItem
                item={item}
                backgroundColor={'white'}
                textColor={'black'}
              />
            )}
            keyExtractor={(item) => item.requestId.toString()}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 52,
  },
  modalView: {
    height: '95%',
    width: '95%',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '400',
  },
})

export default FriendRequestModal
