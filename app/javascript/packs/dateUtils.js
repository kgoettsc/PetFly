import moment from 'moment'

export const shiftTzDate = (date) => {
  if (!date) {
    return
  }
  return moment.utc(date).format('YYYY-MM-DDTHH:mm:ss')
}

export const shiftPickerDate = (date) => {
  let newDate = moment.utc(moment(date).format('YYYY-MM-DDTHH:mm:ss'))
  return newDate.format('YYYY-MM-DDTHH:mm:ss')
}