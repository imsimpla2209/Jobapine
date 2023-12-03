import { Http, instance } from './http'

export const getBackupData = () => {
  return instance.get('admin/all-backup')
}

export const startBackupData = () => {
  return instance.get('admin/backup')
}

export const dropBackupData = data => {
  return instance.post('admin/drop', data)
}

export const getUserSignUpStats = () => {
  return instance.get('admin/userStats')
}

export const getUsers = () => {
  return instance.get('admin/getUsers')
}

export const getSummarizeStats = () => {
  return instance.get('admin/summarizeStats')
}

export const changeActiveUser = (id: string) => {
  return instance.patch('admin/changeActiveUser' + `/${id}`)
}


