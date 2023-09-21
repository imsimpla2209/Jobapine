import { EJobStatus } from 'common/enums'
import mongoose from 'mongoose'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { IProposalDoc, IProposalEmployee, IProposalEmployeeModel, IProposalModel } from './proposal.interfaces'

const proposalSchema = new mongoose.Schema<IProposalDoc, IProposalModel>(
  {
    job: { type: mongoose.Types.ObjectId, ref: 'Job' },
    freelancer: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
    expectedAmount: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      default: 'Nothing :))',
    },
    status: {
      type: String,
      enum: EJobStatus,
      default: EJobStatus.PENDING,
    },
    clientComment: [{ type: String, required: 'false', default: [] }],
    freelancerComment: [{ type: String, required: 'false', default: [] }],
    attachments: [{ type: String, required: 'false', default: [] }],
    contract: { type: mongoose.Types.ObjectId, ref: 'Contract' },
    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message', default: [] }],
  },
  {
    timestamps: true,
  }
)

const proposalEmployeeSchema = new mongoose.Schema<IProposalEmployee, IProposalEmployeeModel>(
  {
    freelancer: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
    proposal: { type: mongoose.Types.ObjectId, ref: 'Proposal' },
    endDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: EJobStatus,
      default: EJobStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
proposalSchema.plugin(toJSON)
proposalSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The proposal's email
 * @param {ObjectId} [excludeProposalId] - The id of the proposal to be excluded
 * @returns {Promise<boolean>}
 */

proposalSchema.pre('save', async function (next) {
  // const proposal = this
  // const user = await getUserById(proposal.user)
  // if (!user.isVerified) {
  //   throw new Error(`User is not verified`)
  // }
  next()
})

const Proposal = mongoose.model<IProposalDoc, IProposalModel>('Proposal', proposalSchema)

export const ProposalEmployee = mongoose.model<IProposalEmployee, IProposalEmployeeModel>(
  'ProposalEmployee',
  proposalEmployeeSchema
)

export default Proposal
