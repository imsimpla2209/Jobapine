import { formatDistanceToNowStrict, format } from 'date-fns'

export const filterDuplicates = (originalArr, arrToConcat) => {
  return arrToConcat.filter(a => !originalArr.find(o => o.id === a.id))
}

export const formatDateAgo = date => {
  return formatDistanceToNowStrict(new Date(date))
}

export const formatDayTime = date => {
  try {
    return format(new Date(date), "MMM d', ' yy 'at' H':'mm")
  } catch (error) {
    return null
  }
}

export const formatDay = date => {
  try {
    return format(new Date(date), "MMM d', 'yyyy'")
  } catch (error) {
    return 'None'
  }
}

export const getErrorMsg = err => {
  if (err.graphQLErrors[0]?.message) {
    return err.graphQLErrors[0].message
  } else {
    return err?.message
  }
}


export function pickName(
  o: { name: string | null; name_vi: string | null } | null,
  lang: string,
) {
  if (lang === 'en') {
    return o?.name || '';
  } else {
    return o?.name_vi || '';
  }
}

export function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function currencyFormatter(money: any, currency: string = 'VND') {
  const currenor = new Intl.NumberFormat('it-IT', {style : 'currency', currency : currency});
  const validMoney = (currency === 'VND' && money < 10000) ? money * 1000 : money
  return `${currenor.format(validMoney)}`
}