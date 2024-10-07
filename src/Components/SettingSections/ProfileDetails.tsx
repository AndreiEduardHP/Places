import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LineComponent from '../LineComponent'
import { useThemeColor } from '../../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { ListItem } from '@rneui/base'
import { useUser } from '../../Context/AuthContext'

interface ProfileDetailsProps {
  data: { icon: string; label: string; value: string | number | undefined }[]
  showIcon?: boolean
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ data, showIcon }) => {
  const { textColor, backgroundColorGrey } = useThemeColor()
  const [expandedInterest, setExpandedInterest] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState(false)
  const { loggedUser } = useUser()
  const loggedUserInterests = loggedUser?.interest
    ? loggedUser.interest.split(',').map((i) => i.trim())
    : []
  const personInterests =
    data
      .find((item) => item.label.toLowerCase() === 'interest')
      ?.value?.toString()
      .split(',')
      .map((i) => i.trim()) || []

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: backgroundColorGrey,
      borderRadius: 10,
      marginHorizontal: 10,
      marginTop: 10,
    },
    commonInterest: {
      color: '#00B0EF', // Change this to the desired highlight color
      fontWeight: 'bold',
    },
    text: {
      color: textColor,
      marginLeft: 10,
      fontSize: 16,
    },
    content: {
      paddingHorizontal: 10,
      paddingVertical: 0,
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
  })

  const shouldRenderAccordion = (item: any) => {
    if (
      item.label.toLowerCase() === 'interest' ||
      item.label.toLowerCase() === 'description'
    ) {
      return (
        item.value &&
        item.value.toString().trim() !== '-' &&
        item.value.toString().length >= 1
      )
    }
    return true
  }

  const getDisplayValue = (label: string, value: any) => {
    if (
      label.toLowerCase() === 'interest' ||
      label.toLowerCase() === 'description'
    ) {
      return value &&
        value.toString().trim() !== '-' &&
        value.toString().length >= 1
        ? value
        : label.toLowerCase() === 'interest'
          ? 'No interest'
          : 'No description'
    }
    return value
  }

  const renderAccordion = (
    item: any,
    isExpanded: boolean,
    setIsExpanded: (value: boolean) => void,
  ) => (
    <ListItem.Accordion
      content={
        <>
          <Icon name={item.icon} size={30} color={textColor} />
          <ListItem.Content>
            <ListItem.Title>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <Text style={styles.text}>{item.label}</Text>
                </View>
                <View style={{ width: 250 }}>
                  <Text
                    style={[styles.text, { marginRight: 100 }]}
                    numberOfLines={1}>
                    {item.label.toLowerCase() === 'interest'
                      ? personInterests.length
                        ? personInterests.map((interest, index) => {
                            const isCommonInterest =
                              loggedUserInterests.includes(interest)
                            return (
                              <Text
                                key={index}
                                style={
                                  isCommonInterest
                                    ? styles.commonInterest
                                    : undefined
                                }>
                                {interest.length >= 1
                                  ? interest
                                  : 'No interest'}
                                {index < personInterests.length - 1 && ', '}
                              </Text>
                            )
                          })
                        : 'No interest'
                      : getDisplayValue(item.label, item.value)}
                  </Text>
                </View>
              </View>
            </ListItem.Title>
          </ListItem.Content>
        </>
      }
      containerStyle={{
        backgroundColor: 'transparent',
        margin: 0,
        paddingVertical: 8,
        paddingHorizontal: 0,
      }}
      isExpanded={isExpanded}
      onPress={() => setIsExpanded(!isExpanded)}
      icon={<Icon name="keyboard-arrow-down" size={30} color={textColor} />}>
      <ListItem
        bottomDivider
        containerStyle={{ backgroundColor: 'transparent' }}>
        <ListItem.Content>
          <ListItem.Title style={styles.text}>
            {item.label.toLowerCase() === 'interest'
              ? personInterests.length
                ? personInterests.map((interest, index) => {
                    const isCommonInterest =
                      loggedUserInterests.includes(interest)
                    return (
                      <Text
                        key={index}
                        style={
                          isCommonInterest ? styles.commonInterest : undefined
                        }>
                        {interest}
                        {index < personInterests.length - 1 && ', '}
                      </Text>
                    )
                  })
                : 'No interest'
              : getDisplayValue(item.label, item.value)}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {shouldRenderAccordion(item) ? (
              item.label.toLowerCase() === 'interest' ? (
                renderAccordion(item, expandedInterest, setExpandedInterest)
              ) : item.label.toLowerCase() === 'description' ? (
                renderAccordion(
                  item,
                  expandedDescription,
                  setExpandedDescription,
                )
              ) : (
                <View style={styles.row}>
                  <Icon name={item.icon} size={30} color={textColor} />
                  <Text style={styles.text} numberOfLines={1}>
                    {item.label}: {getDisplayValue(item.label, item.value)}
                  </Text>
                  {showIcon && (
                    <View style={{ marginLeft: 'auto' }}>
                      <MaterialIcons
                        name="arrow-forward-ios"
                        size={22}
                        color={textColor}
                      />
                    </View>
                  )}
                </View>
              )
            ) : (
              <View style={styles.row}>
                <Icon name={item.icon} size={30} color={textColor} />
                <Text style={styles.text} numberOfLines={1}>
                  {item.label}: {getDisplayValue(item.label, item.value)}
                </Text>
              </View>
            )}
            {index < data.length - 1 && <LineComponent />}
          </React.Fragment>
        ))}
      </View>
    </View>
  )
}

export default ProfileDetails
