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
