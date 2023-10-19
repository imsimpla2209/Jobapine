import axios from 'axios'
import { formatDistanceToNowStrict, format } from 'date-fns'
import { Http } from 'src/api/http'

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

export const fetchPresignedUrl = async (url: any, file: any) => {
  try {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
    const type = file.type
    const requestUrl = url + `?ext=${fileExtension}&type=${type}`
    const uploadConfig = await Http.get(requestUrl)
    await axios.put(uploadConfig.data.url, file.originFileObj, {
      headers: {
        'Content-Type': type,
      },
    })
    return `https://yessir-bucket-tqt.s3.ap-northeast-1.amazonaws.com/${uploadConfig.data.key}`
  } catch (error) {
    console.error(error)
  }
}

export const fetchAllToS3 = async (files: any) => {
  const url = '/api/v1/idea/preSignUrl'
  const requests = files.map(async (file: any) => {
    return await fetchPresignedUrl(url, file).then(result => result)
  })

  return Promise.all(requests)
}