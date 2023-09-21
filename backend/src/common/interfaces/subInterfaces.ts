import { IUserDoc } from '@modules/user/user.interfaces'

export interface IReview {
  creator: IUserDoc['_id']
  content?: string
  rating?: number
  isAnonymous?: boolean
  target?: string
}

export interface IWorkScope {
  workType: IUserDoc['_id']
  locations?: string[]
  jobCategories?: number
  isAnonymous?: boolean
  target?: string
}
