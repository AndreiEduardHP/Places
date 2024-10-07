import React, { useState } from 'react'
import { View, Modal, Image, StyleSheet, Alert } from 'react-native'
import { Button } from '@rneui/base'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { remoteImages } from '../AzureImages/Images'
import { Skeleton } from '@rneui/themed'

type ImageModalProps = {
  visible: boolean
  imageUrl: string
  onClose: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({
  visible,
  imageUrl,
  onClose,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to download images.',
        )
        return
      }

      const fileUri = FileSystem.documentDirectory + `image_${Date.now()}.jpg`

      // Descarcă fișierul de la URL-ul specificat
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri)

      // Creează un asset și salvează-l în galerie
      const asset = await MediaLibrary.createAssetAsync(uri)
      let album = await MediaLibrary.getAlbumAsync('Places')

      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
      } else {
        await MediaLibrary.createAlbumAsync('Places', asset, false)
      }

      Alert.alert(
        'Download Complete',
        'Image has been downloaded successfully.',
      )
    } catch (error) {
      console.error('Error downloading image:', error)
      Alert.alert(
        'Download Failed',
        'There was an error downloading the image.',
      )
    }
  }

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {!isLoaded && (
          <Skeleton
            animation="wave"
            style={[
              styles.modalImage,
              {
                position: 'absolute',
                zIndex: 1,
              },
            ]}
          />
        )}
        <Image
          source={{
            uri: imageUrl ? imageUrl : remoteImages.partyImage,
          }}
          style={styles.modalImage}
          onLoadStart={() => setIsLoaded(false)}
          onLoadEnd={() => setIsLoaded(true)}
        />

        {imageUrl && (
          <Button
            buttonStyle={styles.modalButton}
            title="Download Image"
            onPress={handleDownload}
          />
        )}
        <Button
          buttonStyle={styles.modalButton}
          title="Close"
          onPress={onClose}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
})

export default ImageModal
