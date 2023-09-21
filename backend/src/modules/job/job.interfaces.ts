import { IClientDoc } from '@modules/client/client.interfaces'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { ILevelSkill } from '@modules/skill/skill.interfaces'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IJob {
  client: IClientDoc['_id']
  title: string
  description?: string
  categories?: IJobCategory['_id'][]
  payment?: IJobPayment
  reqSkills?: ILevelSkill[]
  scope?: IJobScope
  status?: string
  checkLists?: string[]
  attachments?: string[]
  proposals?: IProposalDoc['_id'][]
  questions?: string[]
  preferences?: IJobPreferences
  budget?: number
  tags?: IJobTag['_id'][]
  isDeleted?: boolean
}

export interface IJobCategory extends Document {
  name?: string
}

export interface IJobTag extends Document {
  name?: string
}

export interface IJobPreferences {
  nOEmployee?: number // number of employees
  locations?: string[]
}

export interface IJobScope {
  complexity?: number
  duration?: number // number of months
}

export interface IJobPayment {
  amount?: number
  type?: string
}

export interface IJobDoc extends IJob, Document {}

export interface IJobModel extends Model<IJobDoc> {
  isUserSigned(user: mongoose.Types.ObjectId, excludeJobId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export interface IJobCategoryModel extends Model<IJobCategory> {
  isNameTaken(name: string): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export interface IJobTagModel extends Model<IJobTag> {
  isNameTaken(name: string): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateJobBody = Omit<IJob, 'client'>

export type NewCreatedJob = Omit<IJob, 'status' | 'proposals' | 'isDeleted'>

export interface IJobWithTokens {
  user: IJobDoc
  tokens: AccessAndRefreshTokens
}
