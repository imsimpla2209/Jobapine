import { filterFreelancersQuery } from "./freelancer"

export interface IUserInfo {
  name: string
  isActivate?: boolean
  role: string
  username: string
  birthday: string
  email: string
  avatar?: string
  phone?: string
  description?: string
  interests?: string[]
  isBanned?: boolean
  _id?: string
}
// the above will be removed

export interface IUser {
  name: string
  username: string
  email: string
  phone: string
  nationalId: string
  role: string
  isEmailVerified: boolean
  oAuth?: any
  refreshToken?: string
  avatar?: string
  images?: string[]
  dob?: string
  address?: string
  isVerified?: boolean
  isActive?: boolean
  balance?: number
  lastLoginAs?: string
  sickPoints?: number
}

export interface IUserQuery extends filterFreelancersQuery{
  name?: string,
  role?: string,
  isActive?: boolean,
  isVerified?: boolean,
}