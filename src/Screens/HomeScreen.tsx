import { t } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'

import { useUser } from '../Context/AuthContext'
import FooterNavbar from '../Components/FooterNavbar'

const HomeScreen: React.FC = () => {
  const { t } = useTranslation()
  const { loggedUser } = useUser()

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={styles.headerText}>Dear {loggedUser?.firstName}</Text>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>About Places</Text>
        </View>
        <View style={styles.contentContainer}>
          <Image
            source={require('../../assets/world.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Connect with Business Professionals</Text>
          <Text style={styles.description}>
            Places is designed to bridge the gap between you and the business
            world. Whether you're looking for services, partnerships, or just to
            network, Places brings the business community to your fingertips.
            Discover local professionals, connect with businesses, and start
            meaningful conversations that help grow your professional network.
          </Text>
          <Text style={styles.featuresTitle}>Features</Text>
          <Text style={styles.featuresText}>
            - Discover local businesses and professionals
          </Text>
          <Text style={styles.featuresText}>
            - Connect and network with like-minded individuals
          </Text>
          <Text style={styles.featuresText}>
            - Access business information and services easily
          </Text>
          <Text style={styles.featuresText}>
            - Stay updated with the latest business events and news
          </Text>
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={'HomeScreen'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featuresText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
})

export default HomeScreen
