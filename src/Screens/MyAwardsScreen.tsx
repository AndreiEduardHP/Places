import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useUser } from '../Context/AuthContext'
import axios from 'axios'
import { config } from '../config/urlConfig'

interface AwardProps {
  icon: any
  title: string
  progress: string
  disabled?: boolean
}
interface UserDataAwardsDto {
  countJoinedEvents: number
  countCreatedEvents: number
}

const Award: React.FC<AwardProps> = ({
  icon,
  title,
  progress,
  disabled = false,
}) => {
  const { textColor, backgroundColor } = useThemeColor()

  const styles = StyleSheet.create({
    award: {
      alignItems: 'center',
      width: '30%',
      opacity: disabled ? 0.5 : 1, // Apply opacity if disabled
    },
    awardIcon: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
    awardTitle: {
      color: disabled ? '#888' : textColor, // Change color if disabled
      fontSize: 14,
      textAlign: 'center',
    },
    awardProgress: {
      color: disabled ? '#888' : '#aaa', // Change color if disabled
      fontSize: 12,
      textAlign: 'center',
    },
  })

  return (
    <View style={styles.award}>
      <Image source={icon} style={styles.awardIcon} />
      <Text style={styles.awardTitle}>{title}</Text>
      <Text style={styles.awardProgress}>{progress}</Text>
    </View>
  )
}

const MyAwardsScreen: React.FC = () => {
  const { t } = useTranslation()
  const { backgroundColor, textColor } = useThemeColor()
  const { loggedUser } = useUser()
  const [userDataAwards, setUserDataAwards] =
    useState<UserDataAwardsDto | null>(null)
  const styles = StyleSheet.create({
    containerScroll: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    text: {
      fontSize: 32,
      fontWeight: '300',
      marginHorizontal: 20,
      color: textColor,
    },
    textSecondary: {
      fontSize: 14,
      marginTop: 3,
      fontWeight: '300',
      marginHorizontal: 20,
      color: textColor,
    },
    awardsContainer: {
      padding: 8,
      marginTop: 30,
    },
    awardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
  })
  const getUserDataAwards = async (
    userId: number,
  ): Promise<UserDataAwardsDto> => {
    const response = await axios.get<UserDataAwardsDto>(
      `${config.BASE_URL}/api/UserProfile/CheckUserDataAwards/${userId}`,
    )
    return response.data
  }
  useEffect(() => {
    if (loggedUser) {
      getUserDataAwards(loggedUser.id)
        .then(setUserDataAwards)
        .catch(console.error)
    }
  }, [loggedUser])

  const isMoreThanOneMonthOld = () => {
    if (!loggedUser?.dateAccountCreation) {
      return false
    }

    const accountCreationDate = new Date(loggedUser.dateAccountCreation)
    const currentDate = new Date()
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(currentDate.getMonth() - 1)

    return accountCreationDate < oneMonthAgo
  }
  //console.log(isMoreThanOneMonthOld())
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <Text style={styles.text}>My awards</Text>
        <Text style={styles.textSecondary}>
          Awards you're close to earning or ones you already achived.
        </Text>
        <View style={styles.awardsContainer}>
          <View style={styles.awardRow}>
            <Award
              icon={require('../../assets/achieve (2).png')}
              title="Share the app"
              progress={`${loggedUser?.shares} of 7 shares`}
              disabled={(loggedUser?.shares ?? 0) < 7}
            />
            <Award
              icon={require('../../assets/build.png')}
              title="Created events"
              progress={`${userDataAwards?.countCreatedEvents} of 10 events created`}
              disabled={(userDataAwards?.countCreatedEvents ?? 0) < 7}
            />
            <Award
              icon={require('../../assets/join (1).png')}
              title="Joined events"
              progress={`${userDataAwards?.countJoinedEvents} of 10 joined`}
              disabled={(userDataAwards?.countJoinedEvents ?? 0) < 10}
            />
          </View>
          <View style={styles.awardRow}>
            <Award
              icon={require('../../assets/medal.png')}
              title="Account created > one month"
              progress="1 month old"
              disabled={!isMoreThanOneMonthOld()}
            />
            <Award
              icon={require('../../assets/Icons/instagram.png')}
              title="Perfect Week (All Activity)"
              progress="0 of 7 days"
              disabled
            />
            <Award
              icon={require('../../assets/Icons/instagram.png')}
              title="Perfect Week (Stand)"
              progress="0 of 7 days"
              disabled
            />
          </View>
          <View style={styles.awardRow}>
            <Award
              icon={require('../../assets/Icons/instagram.png')}
              title="First Cooldown Workout"
              progress=""
              disabled
            />
            <Award
              icon={require('../../assets/Icons/instagram.png')}
              title="First Core Training Workout"
              progress=""
              disabled
            />
            <Award
              icon={require('../../assets/Icons/instagram.png')}
              title="First Dance Workout"
              progress=""
              disabled
            />
          </View>
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={'SettingScreen'} />
    </View>
  )
}

export default MyAwardsScreen
