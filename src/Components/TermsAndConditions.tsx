import Checkbox from 'expo-checkbox'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native'

interface Props {
  accepted: boolean
  onToggle: () => void
}

const TermsAndConditions: React.FC<Props> = ({ accepted, onToggle }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [checkBoxEnabled, setcheckBoxEnabled] = useState(true)
  return (
    <View style={styles.container}>
      <Checkbox
        value={accepted}
        onValueChange={onToggle}
        style={styles.checkbox}
        disabled={checkBoxEnabled}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Text style={styles.textAgree}>I agree to the </Text>
          </View>
          <View>
            <Text style={styles.textTerms}>Terms and Conditions</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text
                style={{
                  paddingTop: 4,
                  paddingLeft: 37,
                  fontSize: 24,
                  width: '100%',
                }}>
                Terms and Conditions
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible)
                  setcheckBoxEnabled(false)
                }}>
                <Icon name="close" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{
                borderTopColor: 'black',
                borderTopWidth: 1,
                width: '100%',
              }}>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
              <Text style={styles.modalText}>
                Here are the terms and conditions...
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  textAgree: {},
  textTerms: {
    color: 'blue',
  },
  checkbox: {
    marginRight: 8,
  },
  text: {},
  modalHeader: {
    marginBottom: 5,
    width: '100%',
    flexDirection: 'row',

    justifyContent: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  button: {
    borderRadius: 50,
    padding: 5,

    width: 36,
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 15,
    textAlign: 'center',
  },
})

export default TermsAndConditions
