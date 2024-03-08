export const formatDateAndTime = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0') // Add leading 0 if day is less than 10
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed, add leading 0 if month is less than 10
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0') // Add leading 0 if hours are less than 10
  const minutes = date.getMinutes().toString().padStart(2, '0') // Add leading 0 if minutes are less than 10

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
