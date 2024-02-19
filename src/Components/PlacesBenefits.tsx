import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
  ImageBackground,
  Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Person = {
  id: string
  title: string
  description: string
  backgroundImage: ImageSourcePropType
}

const DATA: Person[] = [
  {
    id: '1',
    title: 'David Borg',
    description: 'Twice Frying wings',
    backgroundImage: require('../../assets/premiumUser/lounge.jpg'),
  },
  {
    id: '2',
    title: 'David Borg',
    description: 'Twice Frying wings',
    backgroundImage: require('../../assets/premiumUser/piscina.jpeg'),
  },
  {
    id: '3',
    title: 'David Borg',
    description: 'Twice Frying wings',
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
      <View style={styles.statsContainer}></View>
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 20,
    marginVertical: 8,
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
      android: {
        elevation: 10,
      },
    }),
  },
  itemBackground: {
    // overflow: 'hidden', // Clip the content to the card's bounds
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 26,
    marginLeft: 10,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stats: {
    fontSize: 14,
  },
  connect: {
    fontSize: 14,
    alignSelf: 'flex-end',
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
  },
})

export default PlacesBenefits
