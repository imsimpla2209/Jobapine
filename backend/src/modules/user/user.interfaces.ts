import { IPaymentInfo } from '@modules/payment/payment.interfaces'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IOAuth {
  google: any
  facebook: any
}

export interface IUser {
  name: string
  username: string
  email: string
  phone: string
  nationalId: string
  password: string
  role: string
  isEmailVerified: boolean
  oAuth?: IOAuth
  refreshToken?: string
  avatar?: string
  images?: string[]
  dob?: string
  address?: string
  paymentInfo?: IPaymentInfo
  isVerified?: boolean
  isActive?: boolean
  balance?: number
  lastLoginAs?: string
  sickPoints?: number
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateUserBody = Partial<IUser>

export type NewRegisteredUser = Omit<
  IUser,
  | 'role'
  | 'isEmailVerified'
  | 'provider'
  | 'oAuth'
  | 'paymentInfo'
  | 'isVerified'
  | 'isActive'
  | 'balance'
  | 'refreshToken'
  | 'sickPoints'
>

export type NewCreatedUser = Omit<
  IUser,
  'refreshToken' | 'paymentInfo' | 'isVerified' | 'isActive' | 'lastLoginAs' | 'balance' | 'sickPoints'
>

export interface IUserWithTokens {
  user: IUserDoc
  tokens: AccessAndRefreshTokens
}
