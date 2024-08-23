import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import FooterNavbar from '../Components/FooterNavbar'
import { useThemeColor } from '../Utils.tsx/ComponentColors.tsx/DarkModeColors'
import { useUser } from '../Context/AuthContext'
import axios from 'axios'
import { config } from '../config/urlConfig'
import BackAction from '../Components/Back'
import { formatDateAndTime } from '../Utils.tsx/Services/FormatDate'
import { t } from 'i18next'

interface AwardProps {
  icon: any
  title: string
  progress: string
  disabled?: boolean
  applyTint?: boolean
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
  applyTint = false,
}) => {
  const { textColor, backgroundColor } = useThemeColor()

  const styles = StyleSheet.create({
    award: {
      alignItems: 'center',
      width: '30%',
      opacity: disabled ? 0.5 : 1,
    },
    awardIcon: {
      width: 50,
      height: 50,
      marginBottom: 10,
      tintColor: applyTint ? textColor : undefined,
    },
    awardTitle: {
      color: disabled ? '#888' : textColor,
      fontSize: 14,
      textAlign: 'center',
    },
    awardProgress: {
      color: disabled ? '#888' : '#aaa',
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
  const { backgroundColor, textColor } = useThemeColor()
  const { loggedUser, refreshData } = useUser()
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
      fontSize: 28,
      fontWeight: '300',
      //  marginHorizontal: 20,
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
    refreshData()
  }, [])
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BackAction
            style={{
              width: 26,
              height: 26,
            }}></BackAction>
          <Text style={styles.text}>{t('profileScreen.myAwards')}</Text>
        </View>
        <Text style={styles.textSecondary}>{t('labels.awardsSubTitle')}</Text>
        <View style={styles.awardsContainer}>
          <View style={styles.awardRow}>
            <Award
              icon={require('../../assets/achieve (2).png')}
              title={t('labels.shareTheApp')}
              progress={`${loggedUser?.shares} ${t('labels.of')} 7 `}
              disabled={(loggedUser?.shares ?? 0) < 7}
              applyTint={true}
            />
            <Award
              icon={require('../../assets/build.png')}
              title={t('labels.createdEvents')}
              progress={`${userDataAwards?.countCreatedEvents} ${t('labels.of')} 10`}
              disabled={(userDataAwards?.countCreatedEvents ?? 0) < 7}
              applyTint={true}
            />
            <Award
              icon={require('../../assets/join (1).png')}
              title={t('labels.joinedEvents')}
              progress={`${userDataAwards?.countJoinedEvents} ${t('labels.of')} 10 `}
              disabled={(userDataAwards?.countJoinedEvents ?? 0) < 10}
              applyTint={true}
            />
          </View>
          <View style={styles.awardRow}>
            <Award
              icon={require('../../assets/medal.png')}
              title={t('labels.accountCreated')}
              progress={formatDateAndTime(
                new Date(loggedUser?.dateAccountCreation ?? '2'),
              )}
              disabled={!isMoreThanOneMonthOld()}
              applyTint={true}
            />
            <Award
              icon={require('../../assets/Icons/emailVerify.png')}
              title={
                loggedUser?.emailVerified
                  ? t('labels.emailVerified')
                  : t('labels.emailNotVerified')
              }
              progress={
                loggedUser?.emailVerified ? `${loggedUser.email}` : 'Not yet'
              }
              disabled={!loggedUser?.emailVerified}
            />
            <Award
              icon={require('../../assets/Icons/registration.png')}
              title="Creative Description"
              progress={!loggedUser?.description ? 'No' : 'Yes'}
              disabled={
                !loggedUser?.description || loggedUser?.description === '-'
              }
              applyTint={true}
            />
          </View>
        </View>
      </ScrollView>
      <FooterNavbar currentRoute={'SettingScreen'} />
    </View>
  )
}

export default MyAwardsScreen
