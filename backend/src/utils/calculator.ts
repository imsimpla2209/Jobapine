/* eslint-disable import/prefer-default-export */
import { EPaymenType } from 'common/enums'

export const getWorkTime = (startDate, endDate, paymentType) => {
  const startD = new Date(startDate).getTime()
  const endD = new Date(endDate).getTime()
  const timeDiff = startD - endD
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

  switch (paymentType) {
    case EPaymenType.PERHOURS:
      return days * 10
    case EPaymenType.PERMONTH:
      return days / 30
    default:
      return 0
  }
}
