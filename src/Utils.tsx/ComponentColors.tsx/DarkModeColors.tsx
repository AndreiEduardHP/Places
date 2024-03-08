// useThemeColor.js or a similar file
import { useUser } from '../../Context/AuthContext'

// This is a custom hook
export const useThemeColor = () => {
  const { loggedUser } = useUser()
  const themeColors = {
    backgroundColor: loggedUser?.themeColor === 'dark' ? 'black' : 'white',
    textColor: loggedUser?.themeColor === 'dark' ? 'white' : 'black',
    backgroundColorGrey:
      loggedUser?.themeColor === 'dark' ? '#1C1C1E' : 'rgba(10,10,10,0.1)',
  }
  return themeColors
}
