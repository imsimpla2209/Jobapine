import axios from 'axios'
import { formatDistanceToNowStrict, format } from 'date-fns'
import { Http } from 'src/api/http'

export const filterDuplicates = (originalArr: any[], arrToConcat: any[]) => {
  return arrToConcat.filter((a: { id: any }) => !originalArr.find((o: { id: any }) => o.id === a.id))
}

export const formatDateAgo = (date: string | number | Date) => {
  return formatDistanceToNowStrict(new Date(date))
}

export const formatDayTime = (date: string | number | Date) => {
  try {
    return format(new Date(date), "MMM d', ' yy 'at' H':'mm")
  } catch (error) {
    return null
  }
}

export const formatDay = (date: any) => {
  try {
    return format(new Date(date), "MMM d', 'yyyy'")
  } catch (error) {
    return 'None'
  }
}

export const getErrorMsg = (err: { graphQLErrors: { message: any }[]; message: any }) => {
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

export function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function currencyFormatter(money: any, currency: string = 'VND') {
  const currenor = new Intl.NumberFormat('it-IT', { style: 'currency', currency: currency });
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

export function timeAgo(datetime, t) {
  // Chuyển đổi thời gian datetime thành đối tượng Date
  const date = new Date(datetime).getTime();

  // Lấy thời gian hiện tại
  const now = new Date().getTime();

  // Tính khoảng cách thời gian
  const timeDiff = now - date;

  // Chuyển khoảng cách thời gian thành giây
  const seconds = Math.floor(timeDiff / 1000);

  if (seconds < 60) {
    return seconds + t(seconds === 1 ? ' second ago' : ' seconds ago');
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return minutes + t(minutes === 1 ? ' minute ago' : ' minutes ago');
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours + t(hours === 1 ? ' hour ago' : ' hours ago');
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return days + t(days === 1 ? ' day ago' : ' days ago');
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return months + t(months === 1 ? ' month ago' : ' months ago');
  }

  const years = Math.floor(months / 12);

  return years + t(years === 1 ? ' year ago' : ' years ago');
}
