import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { StripeProvider, useStripe } from '@stripe/stripe-react-native'
import FooterNavbar from '../Components/FooterNavbar'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const packages = [
  {
    id: 'basic',
    name: 'Basic Pack',
    price: '5',
    currency: 'RON',
    credits: '5',
  },
  {
    id: 'standard',
    name: 'Standard Pack',
    price: '10',
    currency: 'RON',
    credits: '5',
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    price: '15',
    currency: 'RON',
    credits: '5',
  },
]

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const { loggedUser, refreshData } = useUser()

  const fetchPaymentSheetParams = async () => {
    const packageDetails = packages.find((p) => p.id === selectedPackage)
    if (!packageDetails) {
      Alert.alert('Error', 'Package details not found.')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${config.BASE_URL}/payment/create-payment-intent`,
        {
          packageId: selectedPackage,
          amount: packageDetails.price,
        },
      )
      const { clientSecret } = response.data

      return clientSecret
    } catch (error) {
      console.error('Error fetching payment sheet params:', error)
      Alert.alert(
        'Error',
        'Unable to fetch payment details. Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }

  const openPaymentSheet = async () => {
    const clientSecret = await fetchPaymentSheetParams()

    if (!clientSecret) return

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'RO',
    })

    if (error) {
      console.error(`Error initializing payment sheet: ${error}`)
      return
    }

    const result = await presentPaymentSheet({})
    if (result.error) {
      Alert.alert('Payment failed', result.error.message)
    } else if (result) {
      const packageDetails = packages.find((p) => p.id === selectedPackage)
      updateUserCredits(loggedUser?.id, packageDetails?.price)

      Alert.alert('Success', 'Payment successful')
    }
  }

  const updateUserCredits = async (userId: any, amount: any) => {
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/UserProfile/UpdateCredit/${userId}`,
        { Amount: amount },
      )

      if (response.status === 200) {
        console.log('Credits updated successfully:', response.data.credit)
        refreshData()
      } else {
        console.error('Failed to update credits:', response.status)
        // Handle other statuses
      }
    } catch (error) {
      console.error('Error updating credits:', error)
      // Handle errors
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Select a Subscription Plan</Text>
        {packages.map((packages) => (
          <TouchableOpacity
            key={packages.id}
            style={[
              styles.button,
              selectedPackage === packages.id && styles.selectedButton,
            ]}
            onPress={() => setSelectedPackage(packages.id as any)}>
            <Text style={styles.buttonText}>
              {packages.name} - {packages.price} (credits:{packages.credits})
            </Text>
          </TouchableOpacity>
        ))}
        <StripeProvider publishableKey="pk_test_51Op4EpBTlGDnVojpVzF4ZIMSKiYRbkgmTqIaTQWXjQ770OmFqdTYrSTquxwBOJyijVhwv8aRgHcudIJIpNasGiou001kLR8gLR">
          <Text>sfs</Text>
        </StripeProvider>

        {selectedPackage && (
          <Text style={{ color: 'white' }}>
            You have selected:{' '}
            {packages.find((packages) => packages.id === selectedPackage)?.name}{' '}
            -{' '}
            {
              packages.find((packages) => packages.id === selectedPackage)
                ?.price
            }
            RON
          </Text>
        )}
        <Button
          title="Proceed to Pay"
          onPress={openPaymentSheet}
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
