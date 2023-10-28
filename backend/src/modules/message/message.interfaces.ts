import { IClientDoc } from '@modules/client/client.interfaces'
import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import mongoose, { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IMessage {
  from: IClientDoc['_id']
  to: IFreelancerDoc['_id']
  other?: IUserDoc['_id'][]
  content?: string
  proposalStatusCatalog?: string[]
  attachments?: string[]
  proposal?: IProposalDoc['_id']
  room?: string
  seen?: boolean
}

export interface IMessageEmployee extends Document {
  freelancer: IFreelancerDoc['_id']
  message: IMessageDoc['_id']
  endDate: string
  status: string
}

export interface IMessageDoc extends IMessage, Document {}

export interface IMessageEmployeeModel extends Model<IMessageEmployee> {}

export interface IMessageModel extends Model<IMessageDoc> {
  isUserSigned(user: mongoose.Types.ObjectId, excludeMessageId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateMessageBody = Omit<IMessage, 'freelancer' | 'job'>

export type NewCreatedMessage = Omit<
  IMessage,
  'status' | 'messages' | 'contract' | 'freelancerComment' | 'clientComment'
>

export interface IMessageWithTokens {
  user: IMessageDoc
  tokens: AccessAndRefreshTokens
}
