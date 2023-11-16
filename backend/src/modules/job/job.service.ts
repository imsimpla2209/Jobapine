/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/dot-notation */

import queryGen from '@core/libs/queryGennerator'
import { getClientById, getClientByOptions } from '@modules/client/client.service'
import { getFreelancerById, getSimilarByFreelancerId, updateSimilarById } from '@modules/freelancer/freelancer.service'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { deleteProposalByOptions } from '@modules/proposal/proposal.service'
import { Skill } from '@modules/skill'
import { EJobStatus } from 'common/enums'
import httpStatus from 'http-status'
import keywordExtractor from 'keyword-extractor'
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
  const categoryFilter = filter['categories']?.length ? { categories: { $in: filter['categories'] || [] } } : {}

  const skillFilter = filter['skills']?.length ? { 'reqSkills.skill': { $in: filter['skills'] || [] } } : {}

  const clientFilter = filter['client'] ? { client: filter['client'] || '' } : {}
  const queryFilter = {
    $and: [
      clientFilter,
      categoryFilter,
      skillFilter,
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }

  if (!options.projectBy) {
    options.populate = 'client,categories,reqSkills.skill'
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, createdAt, proposals, nOEmployee, preferences'
  }
  const jobs = await Job.paginate(queryFilter, options)
  return jobs
}

/**
 * Advanced Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAdvancedJobs = async (
  filter?: Record<string, any>,
  options?: IOptions,
  searchText?: string
): Promise<QueryResult> => {
  filter['title'] && (filter['title'] = { $search: `${filter['title']}`, $diacriticSensitive: true })
  filter['description'] && (filter['description'] = { $regex: `${filter['description']}`, $options: 'i' })

  filter['locations'] && (filter['locations'] = { 'preferences.locations': { $in: filter['locations'] } })
  filter['complexity'] && (filter['complexity'] = { 'scope.complexity': { $in: filter['complexity'] } })
  filter['paymentType'] && (filter['paymentType'] = { 'payment.type': { $in: filter['paymentType'] } })
  filter['skills'] && (filter['skills'] = { 'reqSkills.skill': { $in: filter['skills'] } })
  filter['categories'] && (filter['categories'] = { categories: { $in: filter['categories'] } })
  filter['tags'] && (filter['tags'] = { tags: { $in: filter['tags'] } })
  filter['currentStatus'] && (filter['currentStatus'] = { currentStatus: { $in: filter['currentStatus'] } })

  filter['duration'] &&
    (filter['duration'] = {
      'scope.duration': queryGen.numRanges(filter['duration']?.from, filter['duration']?.to),
    })
  filter['budget'] &&
    (filter['budget'] = {
      budget: queryGen.numRanges((filter['budget']?.from || 0) / 1000, (filter['budget']?.to || 0) / 1000),
    })
  filter['paymentAmount'] &&
    (filter['paymentAmount'] = {
      'payment.amount': queryGen.numRanges(
        (filter['paymentAmount']?.from || 0) / 1000,
        (filter['paymentAmount']?.to || 0) / 1000
      ),
    })
  filter['proposals'] &&
    (filter['proposals'] = { proposals: queryGen.numRanges(filter['nOProposals']?.from, filter['nOProposals']?.to) })
  filter['nOEmployee'] &&
    (filter['nOEmployee'] = {
      'preferences.nOEmployee': queryGen.numRanges(filter['nOEmployee'] === 1 ? 0 : 2, filter['nOEmployee']),
    })
  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [
      {
        $or: [
          // { $text: { $search: `${searchText}`, $caseSensitive: false, $diacriticSensitive: true } },
          { title: { $regex: `${searchText || ''}`, $options: 'si' } },
          { description: { $regex: `${searchText}`, $options: 'i' } },
        ],
      },
      ...filterExtract,
      { isDeleted: { $ne: true } },
    ],
  }

  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
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
      'client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
  }

  const jobs = await Job.paginate(filter, options)
  return jobs
}

/**
 * manually get recommended jobs based on freelancer(low level vcl)
 * @param {string} freelancerId
 * @param {any} filter,
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const getRcmdJob = async (
  freelancerId: mongoose.Types.ObjectId,
  categories: any,
  skills: any,
  options: IOptions
): Promise<QueryResult> => {
  let similarDocs = await getSimilarByFreelancerId(freelancerId)
  if (!similarDocs) {
    similarDocs = await updateSimilarById(freelancerId)
  }

  const categoryFilter = categories?.length ? { categories: { $in: categories || [] } } : {}

  const skillFilter = skills?.length ? { 'reqSkills.skill': { $in: skills || [] } } : {}

  const filter = {
    $and: [
      {
        $or: [
          { title: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
          { description: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
          { categories: { $in: similarDocs?.similarJobCats?.map(c => c.toString()) || [] } },
          { 'reqSkills.skill': { $in: similarDocs?.similarSkills || [] } },
          { tags: { $in: similarDocs?.similarTags || [] } },
          { 'preferences.locations': { $in: similarDocs?.similarLocations || [] } },
        ],
      },
      { isDeleted: { $ne: true } },
      categoryFilter,
      skillFilter,
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }

  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
  }

  const jobs = await Job.paginate(filter, options)
  return jobs
}

/**
 * @returns {Promise<IJobDoc | null>}
 */
export const getAllJob = async (): Promise<IJobDoc[] | null> => {
  const jobs = await Job.find()
    .select(
      'client categories title description locations complexity payment budget createdAt nOProposals nOEmployee preferences'
    )
    .populate([{ path: 'client', select: 'rating spent paymentVerified' }, { path: 'categories' }])
    .lean()

  return jobs
}

/**
 * @returns {Promise<QueryResult | null>}
 */
export const getFavJobByFreelancer = async (
  freelancerId: mongoose.Types.ObjectId,
  options: IOptions
): Promise<QueryResult | null> => {
  const freelancer = await getFreelancerById(freelancerId)

  if (!freelancer) {
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found freelancer')
    }
  }

  const filter = { _id: { $in: freelancer?.favoriteJobs || [] } }

  options.populate = 'client,categories,reqSkills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
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
 * Get job by option
 * @param {object} options
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobsByOptions = async (Options: any): Promise<IJobDoc[] | null> =>
  Job.find({ ...Options, isDeleted: { $ne: true } })
    .populate(['client', 'categories', 'reqSkills.skill', 'proposals'])
    .lean()

/**
 * manually get similar jobs based on job input(low level vcl)
 * @param {mongoose.Types.ObjectId} jobId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const getSimilarJobs = async (jobId: mongoose.Types.ObjectId, options: IOptions): Promise<QueryResult> => {
  const job = await Job.findById(jobId).lean()

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found job')
  }

  let keyWords

  if (job?.title) {
    keyWords = keywordExtractor.extract(
      `${`${job?.title} ${job?.description} ${job?.checkLists?.map(c => c).join(' ')} ${job?.questions
        ?.map(c => c)
        .join(' ')}`}`,
      {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      }
    )

    keyWords = keyWords.map(k => `.*${k}.*`).join('|')
    keyWords = new RegExp(keyWords, 'i')
  }

  const filter = {
    $and: [
      {
        $or: [
          { title: { $regex: `${keyWords}`, $options: 'si' } },
          { description: { $regex: `${keyWords}`, $options: 'si' } },
          { categories: { $in: job?.categories || [] } },
          { 'reqSkills.skill': { $in: job?.reqSkills?.map(s => s.skill) || [] } },
          { tags: { $in: job?.tags || [] } },
          { 'preferences.locations': { $in: job?.preferences?.locations || [] } },
          { 'preferences.nOEmployee': { $eq: job?.preferences?.nOEmployee || 1 } },
          { budget: queryGen.numRanges((job?.budget || 0) - 250, (job?.budget || 0) + 350) },
          { 'scope.complexity': job?.scope?.complexity },
          { 'payment.type': job?.payment?.type },
          {
            'scope.duration': queryGen.numRanges((job?.scope?.duration || 0) - 5, (job?.scope?.duration || 0) + 10),
          },
          {
            'payment.amount': queryGen.numRanges((job?.payment?.amount || 0) - 10, (job?.payment?.amount || 0) + 15),
          },
        ],
      },
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }

  options.populate = 'client,categories'
  if (!options.projectBy) {
    options.projectBy = 'client, categories, title, description, locations, complexity, payment, budget, preferences'
  }

  const jobs = await Job.paginate(filter, options)
  return jobs
}

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
 * Update job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} proposalId
 * @returns {Promise<IJobDoc | null>}
 */
export const addProposaltoJobById = async (
  jobId: mongoose.Types.ObjectId,
  proposalId: string
): Promise<IJobDoc | null> => {
  try {
    const job = await Job.findOneAndUpdate({ _id: jobId }, { $push: { proposals: proposalId } })
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
    }
    return await job.populate('client')
  } catch (err) {
    throw new Error('cannot add proposals to job')
  }
}

/**
 * Update apply job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} freelancerId
 * @returns {Promise<IJobDoc | null>}
 */
export const addApplytoJobById = async (
  jobId: mongoose.Types.ObjectId,
  freelancerId: string
): Promise<IJobDoc | null> => {
  try {
    const job = await Job.findOneAndUpdate({ _id: jobId }, { $push: { appliedFreelancers: freelancerId } })
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
    }
    return job
  } catch (err) {
    throw new Error('cannot add apply to job')
  }
}

/**
 * Update block job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} freelancerId
 * @returns {Promise<IJobDoc | null>}
 */
export const addBlocktoJobById = async (
  jobId: mongoose.Types.ObjectId,
  freelancerId: string
): Promise<IJobDoc | null> => {
  const job = await getJobById(jobId)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  const blockFreelancers = job?.blockFreelancers || []
  Object.assign(job, { blockFreelancers: [...blockFreelancers, freelancerId] })
  await job.save()
  return job
}

/**
 * Update job by id
 * @param {any} options
 * @param {UpdateJobBody} updateBody
 * @returns {Promise<any | null>}
 */
export const updateMulJobByOptions = async (options: any, updateBody: UpdateJobBody): Promise<any | null> => {
  const job = await Job.updateMany(options, updateBody)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
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
  if (job?.questions?.length > 0) {
    if (!proposal?.answers) {
      check = false
    } else if (job?.questions?.length !== Object.keys(proposal?.answers || {}).length) {
      check = false
    }
  }
  // eslint-disable-next-line no-unsafe-optional-chaining
  if (job?.proposals?.length * job?.preferences?.nOEmployee >= 15 * job?.preferences?.nOEmployee) {
    check = false
  }

  if (job?.appliedFreelancers?.includes(proposal.freelancer) || job?.blockFreelancers?.includes(proposal.freelancer)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'This user already applied or is not allowed to apply this job')
  }

  if (!(job?.currentStatus === EJobStatus.PENDING || job?.currentStatus === EJobStatus.OPEN)) {
    check = false
  }

  return check
}
