import React, { useEffect, useState } from 'react'
import { View, Image, FlatList, Dimensions, StyleSheet } from 'react-native'
import { Skeleton } from '@rneui/base'

const { width } = Dimensions.get('window')

interface ImageCarouselProps {
  images: string[] | undefined // List of images as URLs
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [loading, setLoading] = useState<boolean[]>(
    images ? images.map(() => true) : [],
  )
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (images) {
      setData(images)
      setLoading(images.map(() => true))
      console.log(data)
    }
  }, [images])

  const handleImageLoad = (index: number) => {
    setLoading((prevLoading) => {
      const updatedLoading = [...prevLoading]
      updatedLoading[index] = false // Set loading to false for the specific image
      return updatedLoading
    })
  }

  if (images?.length === 1) {
    return (
      <View style={styles.imageContainer}>
        {loading[0] && (
          <Skeleton
            animation="wave"
            style={[styles.image, { position: 'absolute', zIndex: 1 }]}
          />
        )}
        <Image
          source={{ uri: images[0] }}
          style={styles.image}
          onLoad={() => handleImageLoad(0)}
        />
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
        <View style={styles.imageContainer}>
          {loading[index] && (
            <Skeleton
              animation="wave"
              style={[styles.image, { position: 'absolute', zIndex: 1 }]}
            />
          )}
          <Image
            source={{ uri: item }}
            style={styles.image}
            onLoad={() => handleImageLoad(index)}
            onError={(error) => {
              console.log(`Error loading image at index ${index}:`, error)
              handleImageLoad(index) // Call this to hide the skeleton even on error
            }}
          />
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      snapToAlignment="center"
      snapToInterval={width}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={true}
    />
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '95%',
    height: 230,
    resizeMode: 'cover',
    borderRadius: 8,
  },
})

export default ImageCarousel
