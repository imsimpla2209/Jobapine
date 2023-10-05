import { deleteContractByOptions } from '@modules/contract/contract.service'
import { getFreelancerByOptions } from '@modules/freelancer/freelancer.service'
import { isJobOpened } from '@modules/job/job.service'
import { Message } from '@modules/message'
import { updateSickPointsById } from '@modules/user/user.service'
import { EStatus } from 'common/enums'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IProposalDoc, NewCreatedProposal, UpdateProposalBody } from './proposal.interfaces'
import Proposal from './proposal.model'

/**
 * Register a proposal
 * @param {NewCreatedProposal} proposalBody
 * @param {ObjectId} userId
 * @returns {Promise<IProposalDoc>}
 */
export const createProposal = async (
  userId: mongoose.Types.ObjectId,
  proposalBody: NewCreatedProposal
): Promise<IProposalDoc> => {
  const isJobOpen = isJobOpened(proposalBody.job, proposalBody as IProposalDoc)
  if (!isJobOpen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Either you or your proposal is incompatible with job!')
  }
  updateSickPointsById(userId, 5 + (proposalBody?.priority || 0) * 2, true)
  // if (await Proposal.isUserSigned(proposalBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Proposal')
  // }
  return Proposal.create(proposalBody)
}

/**
 * Query for proposals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProposals = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const proposals = await Proposal.paginate(filter, options)
  return proposals
}

/**
 * Get proposal by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProposalDoc | null>}
 */
export const getProposalById = async (id: mongoose.Types.ObjectId): Promise<IProposalDoc | null> =>
  Proposal.findById(id)

/**
 * Get proposals by Job id
 * @param {mongoose.Types.ObjectId} job
 * @returns {Promise<IProposalDoc | null>}
 */
export const getProposalByJobId = async (job: mongoose.Types.ObjectId): Promise<IProposalDoc[] | null> =>
  Proposal.find({ job })

/**
 * Get proposal by option
 * @param {object} Options
 * @returns {Promise<IProposalDoc | null>}
 */
export const getProposalByOptions = async (Options: any): Promise<IProposalDoc | null> => Proposal.findOne(Options)

/**
 * Update proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @param {UpdateProposalBody} updateBody
 * @returns {Promise<IProposalDoc | null>}
 */
export const updateProposalById = async (
  proposalId: mongoose.Types.ObjectId,
  updateBody: UpdateProposalBody
): Promise<IProposalDoc | null> => {
  const proposal = await getProposalById(proposalId)
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }
  if (proposal.currentStatus === EStatus.ACCEPTED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Proposal is already accepted')
  }
  Object.assign(proposal, updateBody)
  await proposal.save()
  return proposal
}

/**
 * Delete proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @returns {Promise<IProposalDoc | null>}
 */
export const deleteProposalById = async (proposalId: mongoose.Types.ObjectId): Promise<IProposalDoc | null> => {
  const proposal = await getProposalById(proposalId)
  if (proposal.currentStatus === EStatus.ACCEPTED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Proposal is already accepted, you only can cancel it')
  }
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }
  await proposal.deleteOne()
  return proposal
}

/**
 * Delete proposal by id
 * @param {mongoose.Types.ObjectId} proposalId
 * @param {string} status
 * @returns {Promise<IProposalDoc | null>}
 */
export const updateProposalStatusById = async (
  proposalId: mongoose.Types.ObjectId,
  status: string
): Promise<IProposalDoc | null> => {
  const proposal = await getProposalById(proposalId)
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }
  Object.assign(proposal, {
    status: {
      status,
      date: new Date(),
    },
  })
  await proposal.save()
  return proposal
}

/**
 * Delete proposal by options
 * @param {any} jobId
 * @returns {Promise<void>}
 */
export const deleteProposalByOptions = async (options: any): Promise<void> => {
  Proposal.find(options)
    .select('id')
    .then(data => {
      data.forEach(async d => {
        Message.deleteMany({ proposal: d.id })
        const u = await getFreelancerByOptions({ proposals: { $all: [d.id] } })
        u.proposals = u.proposals.filter(p => p.id !== d.id)
        u.save()
      })
    })
    .then(() => {
      Proposal.deleteMany(options)
      deleteContractByOptions(options)
    })
}
