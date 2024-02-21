// PaymentScreen.tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useStripe } from '@stripe/stripe-react-native'
import FooterNavbar from '../Components/FooterNavbar'

// Define subscription options
const subscriptions = [
  { id: 'basic', name: 'Basic Plan', price: '$5/month' },
  { id: 'standard', name: 'Standard Plan', price: '$10/month' },
  { id: 'premium', name: 'Premium Plan', price: '$15/month' },
]

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [loading, setLoading] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState(null)

  useEffect(() => {
    // You might want to call this when the user selects a plan instead
  }, [])

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      Alert.alert('Success', 'Payment successful')
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Select a Subscription Plan</Text>
        {subscriptions.map((subscription) => (
          <TouchableOpacity
            key={subscription.id}
            style={[
              styles.button,
              selectedSubscription === subscription.id && styles.selectedButton,
            ]}
            onPress={() => setSelectedSubscription(subscription.id as any)}>
            <Text style={styles.buttonText}>
              {subscription.name} - {subscription.price}
            </Text>
          </TouchableOpacity>
        ))}

        {selectedSubscription && (
          <Text style={{ color: 'white' }}>
            You have selected:{' '}
            {
              subscriptions.find(
                (subscription) => subscription.id === selectedSubscription,
              )?.name
            }{' '}
            -{' '}
            {
              subscriptions.find(
                (subscription) => subscription.id === selectedSubscription,
              )?.price
            }
          </Text>
        )}
        <Button
          title="Proceed to Pay"
          onPress={() => {
            //  initializePaymentSheet()
          }}
          disabled={loading}
        />
      </View>
      <View>
        <FooterNavbar currentRoute={''} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#DDDDDD',
  },
  selectedButton: {
    backgroundColor: '#AAAAFF',
  },
  buttonText: {
    fontSize: 16,
  },
})

export default PaymentScreen
