import { IJobCategory, IJobDoc } from '@modules/job/job.interfaces'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { ILevelSkill } from '@modules/skill/skill.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import { IReview } from 'common/interfaces/subInterfaces'
import { Document, Model } from 'mongoose'
import { QueryResult } from '../../providers/paginate/paginate'

export interface IFreelancer {
  user: IUserDoc['_id']
  name: string
  intro?: string
  member?: IUserDoc['_id'][]
  // tests?: ITestDoc['_id'][]
  skills?: ILevelSkill[]
  certificate?: string
  proposals?: IProposalDoc['_id'][]
  images?: string[]
  reviews?: IReview[]
  favoriteJobs?: IJobDoc['_id'][]
  preferJobType?: IJobCategory['_id'][]
  currentLocations?: string[]
  preferencesURL?: string[]
  rating?: number
}

export interface IFreelancerDoc extends IFreelancer, Document {}

export interface IFreelancerModel extends Model<IFreelancerDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateFreelancerBody = Omit<IFreelancer, 'user'>

export type NewRegisteredFreelancer = Omit<
  IFreelancer,
  'member' | 'tests' | 'onJobs' | 'reviews' | 'proposals' | 'favoriteJobs' | 'rating'
>
