import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
  ImageBackground,
  Platform,
} from 'react-native'

type Person = {
  id: string
  title: string
  description: string
  backgroundImage: ImageSourcePropType
}

const DATA: Person[] = [
  {
    id: '1',
    title: 'Exclusive Networking Opportunities',
    description: 'Access to Premium Networking Events and Forums',
    backgroundImage: require('../../assets/premiumUser/lounge.jpg'),
  },
  {
    id: '2',
    title: 'Advanced Analytics and Insights',
    description: 'In-Depth Business Analytics and Performance Reports',
    backgroundImage: require('../../assets/premiumUser/piscina.jpeg'),
  },
  {
    id: '3',
    title: 'Advanced Analytics and Insights',
    description: ' In-Depth Business Analytics and Performance Reports',
    backgroundImage: require('../../assets/premiumUser/birou.jpeg'),
  },
]

type ItemProps = {
  title: string
  description: string
  backgroundImage: ImageSourcePropType
}

const Item: React.FC<ItemProps> = ({ title, description, backgroundImage }) => (
  <ImageBackground
    source={backgroundImage}
    style={styles.item}
    imageStyle={{ borderRadius: 6 }}>
    <View>
      <View>
        <Text style={styles.userName}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View></View>
    </View>
  </ImageBackground>
)

const PlacesBenefits: React.FC = () => {
  const renderItem = ({ item }: { item: Person }) => (
    <Item
      title={item.title}
      description={item.description}
      backgroundImage={item.backgroundImage}
    />
  )

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal={true}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    marginVertical: 8,
    opacity: 0.87,
    marginLeft: 16,
    borderRadius: 6,
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    width: 300,

    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
  },

  userName: {
    fontSize: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    marginTop: 15,
    color: 'rgba(250,250,250,1)',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
})

export default PlacesBenefits
