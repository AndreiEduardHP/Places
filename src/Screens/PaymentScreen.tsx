import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native'
import { StripeProvider, useStripe } from '@stripe/stripe-react-native'
import FooterNavbar from '../Components/FooterNavbar'
import axios from 'axios'
import { config } from '../config/urlConfig'
import { useUser } from '../Context/AuthContext'
import { useTranslation } from 'react-i18next'
import SvgComponent2 from '../Components/SVG/Shapes/Wow'
import SvgComponent10 from '../Components/SVG/Shapes/10CreditCard'
import SvgComponent5 from '../Components/SVG/Shapes/5CreditCard'
import { LinearGradient } from 'expo-linear-gradient'
import SVGComponentOFFERS from '../Components/SVG/Shapes/UnlimitedOffers'
import GradientText from '../Components/SVG/Gradient'

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const { loggedUser, refreshData } = useUser()
  const [selectedSvg, setSelectedSvg] = useState<any>(null)
  const scrollX = useRef(new Animated.Value(0)).current
  const { t } = useTranslation()
  const packages = [
    {
      id: 1,
      name: t('paymentsScreen.basicPack'),
      price: '5',
      currency: 'RON',
      credits: '5',
    },
    {
      id: 2,
      name: t('paymentsScreen.standardPack'),
      price: '10',
      currency: 'RON',
      credits: '10',
    },
    {
      id: 3,
      name: t('paymentsScreen.premiumPack'),
      price: '15',
      currency: 'RON',
      credits: '20',
    },
  ]
  const svgComponents = [
    {
      id: 1,
      component: (
        <SvgComponent5
          name={`${loggedUser?.firstName ?? ''} ${loggedUser?.lastName ?? ''}`}
          type="Basic Pack"
        />
      ),
      credits: 5,
      price: 5,
    },

    {
      id: 2,
      component: (
        <SvgComponent2
          name={`${loggedUser?.firstName ?? ''} ${loggedUser?.lastName ?? ''}`}
          type="Standard Pack"
        />
      ),
      credits: 10,
      price: 10,
    },
    {
      id: 3,
      component: (
        <SvgComponent10
          name={`${loggedUser?.firstName ?? ''} ${loggedUser?.lastName ?? ''}`}
          type="Premium Pack"
        />
      ),
      credits: 20,
      price: 20,
    },
  ]

  useEffect(() => {
    startScrolling()
  }, [])

  const startScrolling = () => {
    scrollX.setValue(0)
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -1000, // Adjust to the total width of the text
        duration: 10000, // Adjust the duration as needed
        useNativeDriver: true,
      }),
    ).start()
  }

  const fetchPaymentSheetParams = async () => {
    const packageDetails = packages.find((p) => p.id === selectedSvg)
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
      const packageDetails = packages.find((p) => p.id === selectedSvg)
      updateUserCredits(loggedUser?.id, packageDetails?.credits)

      Alert.alert('Success', 'Payment successful')
    }
  }

  const updateUserCredits = async (userId: any, amount: any) => {
    console.log(userId, amount)
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/UserProfile/UpdateCredit/${userId}`,
        { Amount: amount },
      )

      if (response.status === 200) {
        refreshData()
      } else {
        console.error('Failed to update credits:', response.status)
      }
    } catch (error) {
      console.error('Error updating credits:', error)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}> {t('paymentsScreen.selectAPack')}</Text>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <Text style={styles.textStyle1}>
            {loggedUser?.firstName} {loggedUser?.lastName}
          </Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flex: 1,
            marginTop: -270,
            height: 10,
            marginLeft: -20,
            // backgroundColor: 'blue',
          }}>
          {svgComponents.map((svg) => (
            <TouchableOpacity
              key={svg.id}
              style={[
                styles.card,
                selectedSvg === svg.id
                  ? styles.selectedButton
                  : styles.unselectedButton,
              ]}
              onPress={() => setSelectedSvg(svg.id as any)}>
              <View style={styles.card}>{svg.component}</View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View
          style={{
            flex: 1,
            // marginBottom: 20,
            marginTop: -65,

            alignItems: 'center',
          }}>
          <SVGComponentOFFERS credits={loggedUser?.credit}></SVGComponentOFFERS>
          {/*  <Text style={styles.textStyle}>YOUR CREDITS</Text> 

          <Text
            style={{
              color: 'white',
              fontSize: 37,
              fontWeight: '300',
              letterSpacing: 1,
            }}>
            {loggedUser?.credit}
          </Text>*/}
        </View>

        {selectedSvg && (
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,1)',
              marginHorizontal: 20,
              borderColor: 'white',
              borderWidth: 0.5,
              padding: 5,
              marginTop: -1,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '300',
                fontSize: 22,
              }}>
              {t('paymentsScreen.youHaveSelected')}:{' '}
              <GradientText
                svgStyle={{ marginTop: -3 }}
                fontSize={24}
                textLines={[
                  packages.find((pack) => pack.id === selectedSvg)?.name || '',
                ]}
                gradientStops={[
                  { color: '#F103AE', offset: '0%' },
                  { color: '#FF5447', offset: '50%' },
                  { color: '#FF7B21', offset: '80%' },
                  { color: '#F1F3FF', offset: '100%' },
                ]}
              />
            </Text>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '300' }}>
              Price:{' '}
              {packages.find((pack) => pack.id === selectedSvg)?.price +
                ' RON' ?? 'Default Price'}{' '}
              <Text style={{ color: '#CADCFC', fontSize: 24 }}>
                {' '}
                <GradientText
                  svgStyle={{ marginTop: -2 }}
                  fontSize={22}
                  textLines={[
                    packages.find((pack) => pack.id === selectedSvg)?.credits +
                      ' CREDITS RECEIVED' ?? 'CREDITS',
                  ]}
                  gradientStops={[
                    { color: '#F103AE', offset: '0%' },
                    { color: '#CADCFC', offset: '100%' },
                  ]}></GradientText>
              </Text>
            </Text>
          </View>
        )}
        <View style={{ display: 'none' }}>
          <StripeProvider publishableKey="pk_test_51Op4EpBTlGDnVojpVzF4ZIMSKiYRbkgmTqIaTQWXjQ770OmFqdTYrSTquxwBOJyijVhwv8aRgHcudIJIpNasGiou001kLR8gLR">
            <Text> {t('paymentsScreen.payments')}</Text>
          </StripeProvider>
        </View>

        <TouchableOpacity onPress={openPaymentSheet} style={styles.button}>
          <Text style={styles.buttonText}>Proceed to Pay</Text>
        </TouchableOpacity>
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
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,

    backgroundColor: 'black',
  },

  text: {
    color: 'white',
    marginHorizontal: 50, // Space between repetitions of text
  },
  textStyle: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 17,
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'white',
  },
  textStyle1: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 37,

    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(217,217,217,1)',
  },
  title: {
    fontStyle: 'normal',
    fontWeight: '400',

    fontSize: 22,
    lineHeight: 30,
    color: 'white',
    marginTop: 20,
    marginBottom: 5,
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  button: {
    padding: 8,
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    margin: 15,
    marginHorizontal: 21,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedButton: {
    opacity: 1,
  },
  unselectedButton: {
    opacity: 0.6,
  },
  card: {
    height: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888',
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#aaa',
  },
  selectedText: {
    color: '#fff',
  },
})

export default PaymentScreen
