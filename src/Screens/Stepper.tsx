import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import Stepper from 'react-native-stepper-ui'
import TermsAndConditions from '../Components/TermsAndConditions'
import EventDetails from '../Components/MapRelated/EventDetailsDrawer'
import { MapMarkerDetail } from '../Interfaces/IUserData'
import { Text } from '@rneui/themed'
interface StepperHorizontalProps {
  selectedMarker: MapMarkerDetail | null
  drawerVisible: boolean
  createdByUserId: number | undefined
  isChecked: boolean
  setChecked: (value: boolean) => void
  userHasJoined: boolean
  refreshSelectedMarkerData: (updatedEvent: MapMarkerDetail) => void
  handleUnJoinEvent: () => void
  handleJoinEvent: () => void
  routeDistance: number | null
  routeDuration: number | null
  openGoogleMaps: () => void
  markers: MapMarkerDetail[]
  refreshParticipantsTrigger: boolean
}

const StepperHorizontal: React.FC<StepperHorizontalProps> = ({
  selectedMarker,
  drawerVisible,
  createdByUserId,
  isChecked,
  setChecked,
  userHasJoined,
  refreshSelectedMarkerData,
  handleUnJoinEvent,
  handleJoinEvent,
  routeDistance,
  routeDuration,
  openGoogleMaps,
  markers,
  refreshParticipantsTrigger,
}) => {
  const [active, setActive] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleAcceptanceToggle = () => {
    setTermsAccepted(!termsAccepted)
  }

  const content = [
    <View
      style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
      <TermsAndConditions
        accepted={termsAccepted}
        onToggle={handleAcceptanceToggle}
      />
    </View>,
    <View
      style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>
        Are you sure you want to atend this event?
      </Text>
    </View>,
    <EventDetails
      refreshSelectedMarkerData={refreshSelectedMarkerData}
      selectedMarker={selectedMarker}
      createdByUserId={createdByUserId}
      drawerVisible={drawerVisible}
      isChecked={isChecked}
      setChecked={setChecked}
      userHasJoined={userHasJoined}
      handleUnJoinEvent={handleUnJoinEvent}
      handleJoinEvent={handleJoinEvent}
      routeDistance={routeDistance}
      routeDuration={routeDuration}
      openGoogleMaps={openGoogleMaps}
      markers={markers}
      refreshParticipantsTrigger={refreshParticipantsTrigger}
    />,
  ]

  const handleNext = () => {
    if (active === 0 && !termsAccepted) {
      Alert.alert(
        'Terms and Conditions',
        'You must accept the terms and conditions to proceed.',
      )
    } else {
      setActive(active + 1)
    }
  }

  return (
    <View style={{ marginTop: 5, marginHorizontal: 5 }}>
      <Stepper
        active={active}
        content={content}
        onBack={() => setActive(active - 1)}
        onFinish={() => alert('Finish')}
        onNext={handleNext}
        //  termsAccepted={termsAccepted}
      />
    </View>
  )
}

export default StepperHorizontal
