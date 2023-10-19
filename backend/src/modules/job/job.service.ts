/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/dot-notation */

import queryGen from '@core/libs/queryGennerator'
import { getClientById, getClientByOptions } from '@modules/client/client.service'
import { getSimilarByFreelancerId, updateSimilarById } from '@modules/freelancer/freelancer.service'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { deleteProposalByOptions } from '@modules/proposal/proposal.service'
import { Skill } from '@modules/skill'
import { EJobStatus } from 'common/enums'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IJobDoc, NewCreatedJob, UpdateJobBody } from './job.interfaces'
import Job, { JobCategory, JobTag } from './job.model'

/**
 * Create a job
 * @param {NewCreatedJob} jobBody
 * @returns {Promise<IJobDoc>}
 */
export const createJob = async (jobBody: NewCreatedJob): Promise<IJobDoc> => {
  const client = await getClientById(jobBody.client)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found client')
  }
  const createdJob = await Job.create(jobBody)
  client.jobs = client.jobs.concat(createdJob._id)
  return createdJob
}

/**
 * Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryJobs = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, nOProposals, nOEmployee, preferences'
  }
  const jobs = await Job.paginate(filter, options)
  return jobs
}

/**
 * Advanced Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAdvancedJobs = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['title'] && (filter['title'] = { $search: `${filter['title']}`, $diacriticSensitive: true })
  filter['description'] && (filter['description'] = { $regex: `${filter['description']}`, $options: 'i' })

  filter['preferences.locations'] && (filter['preferences.locations'] = { $in: filter['preferences.locations'] })
  filter['scope.complexity'] && (filter['scope.complexity'] = { $in: filter['scope.complexity'] })
  filter['payment.type'] && (filter['payment.type'] = { $in: filter['payment.type'] })
  filter['reqSkills'] && (filter['reqSkills'] = { $in: filter['reqSkills'] })
  filter['categories'] && (filter['categories'] = { $in: filter['categories'] })
  filter['tags'] && (filter['tags'] = { $in: filter['tags'] })
  filter['currentStatus'] && (filter['currentStatus'] = { $in: filter['currentStatus'] })

  filter['scope.duration'] &&
    (filter['scope.duration'] = queryGen.numRanges(filter['scope.duration']?.from, filter['scope.duration']?.to))
  filter['budget'] && (filter['budget'] = queryGen.numRanges(filter['budget']?.from, filter['budget']?.to))
  filter['payment.amount'] &&
    (filter['payment.amount'] = queryGen.numRanges(filter['payment.amount']?.from, filter['payment.amount']?.to))
  filter['proposals'] &&
    (filter['proposals'] = { $size: queryGen.numRanges(filter['nOProposals']?.from, filter['nOProposals']?.to) })
  filter['preferences.nOEmployee'] &&
    (filter['preferences.nOEmployee'] = queryGen.numRanges(
      filter['preferences.nOEmployee']?.from,
      filter['preferences.nOEmployee']?.to
    ))

  const queryFilter = {
    $and: [filter, { isDeleted: { $ne: true } }, { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } }],
  }

  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, nOProposals, nOEmployee, preferences'
  }

  const jobs = await Job.paginate(queryFilter, options)
  return jobs
}

/**
 * search jobs by text
 * @param {string} searchText - text
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const searchJobsByText = async (searchText: string, options: IOptions): Promise<QueryResult> => {
  const foundCats = await JobCategory.find({ name: { $regex: searchText, $options: 'i' } })
  const foundSkills = await Skill.find({ name: { $regex: searchText, $options: 'i' } })
  const foundTags = await JobTag.find({ name: { $regex: searchText, $options: 'i' } })

  const filter = {
    $and: [
      {
        $or: [
          { title: { $search: searchText, $diacriticSensitive: true } },
          { description: { $regex: searchText, $options: 'i' } },
          { categories: { $in: foundCats || [] } },
          { 'reqSkills.skill': { $in: foundSkills || [] } },
          { tags: { $in: foundTags || [] } },
        ],
      },
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }

  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, nOProposals, nOEmployee, preferences'
  }

  const jobs = await Job.paginate(filter, options)
  return jobs
}

/**
 * manually get recommended jobs based on freelancer(low level vcl)
 * @param {string} freelancerId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const getRcmdJob = async (freelancerId: mongoose.Types.ObjectId, options: IOptions): Promise<QueryResult> => {
  const similarDocs = await getSimilarByFreelancerId(freelancerId)

  if (!similarDocs) {
    await updateSimilarById(freelancerId)
  }

  const filter = {
    $and: [
      {
        $or: [
          { title: { $regex: similarDocs.similarKeys, $options: 'i' } },
          { description: { $regex: similarDocs.similarKeys, $options: 'i' } },
          { categories: { $in: similarDocs.similarJobCats || [] } },
          { reqSkills: { $in: similarDocs.similarSkills || [] } },
          { tags: { $in: similarDocs.similarTags || [] } },
          { 'preferences.locations': { $in: similarDocs.similarLocations || [] } },
        ],
      },
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }

  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, nOProposals, nOEmployee, preferences'
  }

  const jobs = await Job.paginate(filter, options)
  return jobs
}

/**
 * Get job by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobById = async (id: mongoose.Types.ObjectId): Promise<IJobDoc | null> =>
  Job.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

/**
 * Get job by title
 * @param {string} title
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobBytitle = async (title: string): Promise<IJobDoc | null> =>
  Job.findOne({ title, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

/**
 * Get job by option
 * @param {object} options
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobByOptions = async (Options: any): Promise<IJobDoc | null> =>
  Job.findOne({ ...Options, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

/**
 * Update job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {UpdateJobBody} updateBody
 * @returns {Promise<IJobDoc | null>}
 */
export const updateJobById = async (
  jobId: mongoose.Types.ObjectId,
  updateBody: UpdateJobBody
): Promise<IJobDoc | null> => {
  const job = await getJobById(jobId)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  Object.assign(job, updateBody)
  await job.save()
  return job
}

/**
 * Delete job by id (only for admin)
 * @param {mongoose.Types.ObjectId} jobId
 * @returns {Promise<IJobDoc | null>}
 */
export const deleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
  const job = await getJobById(jobId)
  const client = await getClientByOptions({ job: jobId })
  deleteProposalByOptions({ job: jobId })
  if (job) {
    client.jobs = client.jobs.filter(j => j !== jobId)
    client.save()
  }
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  await job.deleteOne()
  return job
}

/**
 * Soft Delete job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @returns {Promise<IJobDoc | null>}
 */
export const softDeleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
  const job = await Job.findByIdAndUpdate(jobId, { isDeleted: true })
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  return job
}

/**
 * Change status job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} status
 * @returns {Promise<IJobDoc | null>}
 */
export const changeStatusJobById = async (
  jobId: mongoose.Types.ObjectId,
  status: string,
  comment: string
): Promise<IJobDoc | null> => {
  const job = await Job.findByIdAndUpdate(jobId, {
    status: {
      status,
      date: new Date(),
      comment: comment || '',
    },
  })
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  return job
}

/**
 * check is job opened by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {IProposalDoc} proposal
 * @returns {Promise<boolean | null>}
 */
export const isJobOpened = async (jobId: mongoose.Types.ObjectId, proposal: IProposalDoc): Promise<boolean | null> => {
  const job = await Job.findById(jobId)
  let check = true
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  if (job?.questions?.length !== Object.keys(proposal.answers).length) {
    check = false
  }
  // eslint-disable-next-line no-unsafe-optional-chaining
  if (job?.proposals?.length * job?.preferences?.nOEmployee >= 15 * job?.preferences?.nOEmployee) {
    check = false
  }
  return (
    !!(job?.status?.at(-1)?.status === EJobStatus.PENDING || job?.status?.at(-1)?.status === EJobStatus.OPEN) && check
  )
}
