import { createSubscription } from 'libs/global-state-hook'
export interface ISkill {
  name: string
  name_vi: string
  category: string
  isDeleted: boolean
}
export const locationStore = createSubscription<{ name: string; code: string }[]>([])

export const skillStore = createSubscription([])
export const categoryStore = createSubscription([])
