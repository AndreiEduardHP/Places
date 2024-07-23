export const validateEmail = (email: string) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  if (!emailRegex.test(email) && email) {
    return false
  }

  return true
}

export const validatePhoneNumber = (phoneNumber: string) => {
  const phoneNumberRegex = /^[1-9]\d{8,}$/

  if (!phoneNumberRegex.test(phoneNumber)) {
    return true
  }

  return false
}
