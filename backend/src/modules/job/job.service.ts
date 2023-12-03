/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/dot-notation */

import queryGen from '@core/libs/queryGennerator'
import { getClientById, getClientByOptions } from '@modules/client/client.service'
import { IFreelancerDoc } from '@modules/freelancer/freelancer.interfaces'
import { getFreelancerById, getSimilarByFreelancerId, updateSimilarById } from '@modules/freelancer/freelancer.service'
import { bulkCreateNotify } from '@modules/notify/notify.service'
import { IProposalDoc } from '@modules/proposal/proposal.interfaces'
import { deleteProposalByOptions, updateProposalStatusBulk } from '@modules/proposal/proposal.service'
import { Skill } from '@modules/skill'
import { User } from '@modules/user'
import { EJobStatus, EStatus } from 'common/enums'
import { FEMessage, FERoutes } from 'common/enums/constant'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import keywordExtractor from 'keyword-extractor'
import mongoose from 'mongoose'
import { createFuzzyRegex, extractKeywords } from 'utils/helperFunc'
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
export const queryJobs = async (
  filter: Record<string, any>,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  const titleFilter = filter['searchText'] ? { title: { $regex: `${filter.searchText || ''}`, $options: 'i' } } : {}

  const categoryFilter = filter['categories']?.length ? { categories: { $in: filter['categories'] || [] } } : {}

  const skillFilter = filter['skills']?.length ? { 'reqSkills.skill': { $in: filter['skills'] || [] } } : {}

  const clientFilter = filter['client'] ? { client: filter['client'] || '' } : {}

  let filterByFreelancer = []

  if (freelancer) {
    filterByFreelancer.push({ appliedFreelancers: { $nin: [freelancer?._id] } })
    filterByFreelancer.push({ blockFreelancers: { $nin: [freelancer?._id] } })
    if (freelancer?.jobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.jobs } })
    }
    if (freelancer?.favoriteJobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.favoriteJobs?.map(j => j?.toString()) } })
    }
  }

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

  const queryFilter = {
    $and: [
      titleFilter,
      clientFilter,
      categoryFilter,
      skillFilter,
      ...filterByFreelancer,
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }

  if (!options.projectBy) {
    options.sortBy = 'updatedAt:desc'
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
  searchText?: string,
  freelancer?: IFreelancerDoc | null
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

  let filterByFreelancer = []

  if (freelancer) {
    filterByFreelancer.push({ appliedFreelancers: { $nin: [freelancer?._id] } })
    filterByFreelancer.push({ blockFreelancers: { $nin: [freelancer?._id] } })
    if (freelancer?.jobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.jobs } })
    }
    if (freelancer?.favoriteJobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.favoriteJobs?.map(j => j?.toString()) } })
    }
  }

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

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
      ...filterByFreelancer,
      ...filterExtract,
      { isDeleted: { $ne: true } },
    ],
  }

  options.populate = 'client,categories,reqSkills.skill'
  options.sortBy = 'updatedAt:desc'
  if (!options.projectBy) {
    options.projectBy =
      'client, categories, title, description, locations, scope, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
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
export const searchJobsByText = async (
  searchText: string,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  const foundCats = await JobCategory.find({ name: { $regex: searchText, $options: 'i' } })
  const foundSkills = await Skill.find({ name: { $regex: searchText, $options: 'i' } })
  const foundTags = await JobTag.find({ name: { $regex: searchText, $options: 'i' } })

  let filterByFreelancer = []

  if (freelancer) {
    filterByFreelancer.push({ appliedFreelancers: { $nin: [freelancer?._id] } })
    filterByFreelancer.push({ blockFreelancers: { $nin: [freelancer?._id] } })
    if (freelancer?.jobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.jobs } })
    }
    if (freelancer?.favoriteJobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.favoriteJobs?.map(j => j?.toString()) } })
    }
  }

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

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
      ...filterByFreelancer,
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN, EJobStatus.PENDING] } },
    ],
  }
  options.sortBy = 'updatedAt:desc'

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
 * @param {IFreelancerDoc} freelancer
 * @returns {Promise<QueryResult>}
 */
export const getRcmdJob = async (
  freelancerId: mongoose.Types.ObjectId,
  categories: any,
  skills: any,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  let similarDocs = await getSimilarByFreelancerId(freelancerId)
  if (!similarDocs) {
    similarDocs = await updateSimilarById(freelancerId)
  }

  if (!options?.projectBy) {
    options.projectBy = `client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, 
      nOEmployee, preferences, totalScore, 
      score_title, score_description, score_skills, score_locations, score_categories, score_expertise, score_paymentAmount, score_paymentType`
  }

  if (!options?.populate) {
    options.populate = 'client,categories,reqSkills.skill'
  }

  const projectFields = options.projectBy.split(',').reduce((acc, field) => {
    acc[field.trim()] = 1
    return acc
  }, {})

  const populateFields = options?.populate?.split(',').map(field => {
    if (field.trim() === 'client') {
      return {
        path: field.trim(),
        match: { isDeleted: { $ne: true } },
        select: 'rating spent paymentVerified name user preferLocations',
      }
    }
    return { path: field.trim() }
  })

  const preferSkills = freelancer?.skills?.map(s => ({ ...s, skill: s?.skill?.toString() }))

  logger.info(`preferSkils: ${typeof preferSkills[0].skill}`)

  const filterPipeline: any = [
    {
      $match: {
        $or: [
          { title: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
          { description: { $regex: `${similarDocs?.similarKeys}`, $options: 'si' } },
          { categories: { $in: similarDocs?.similarJobCats?.map(c => c.toString()) || [] } },
          { 'reqSkills.skill': { $in: similarDocs?.similarSkills || [] } },
          { tags: { $in: similarDocs?.similarTags || [] } },
          { 'preferences.locations': { $in: similarDocs?.similarLocations || [] } },
        ],
      },
    },
    {
      $match: {
        $and: [
          { appliedFreelancers: { $nin: [freelancer?._id] } },
          { blockFreelancers: { $nin: [freelancer?._id] } },
          { _id: { $nin: freelancer?.jobs || [] } },
          { _id: { $nin: freelancer?.favoriteJobs?.map(j => j?.toString()) || [] } },
        ],
      },
    },
    {
      $match: {
        $and: [
          { isDeleted: { $ne: true } },
          { currentStatus: { $in: [EJobStatus.OPEN] } },
          categories?.length ? { categories: { $in: categories || [] } } : {},
          skills?.length ? { 'reqSkills.skill': { $in: skills || [] } } : {},
        ],
      },
    },

    {
      $addFields: {
        score_title: {
          $cond: [{ $regexMatch: { input: '$title', regex: similarDocs?.similarKeys } }, 1, 0],
        },
        score_description: {
          $cond: [{ $regexMatch: { input: '$description', regex: similarDocs?.similarKeys } }, 1, 0],
        },
        score_categories: {
          $multiply: [
            { $size: { $setIntersection: [similarDocs?.similarJobCats || [], { $ifNull: ['$categories', []] }] } },
            1.5,
          ],
        },
        score_skills: {
          $multiply: [
            { $size: { $setIntersection: [similarDocs?.similarSkills || [], { $ifNull: ['$reqSkills.skill', []] }] } },
            1.25,
          ],
        },
        score_tags: { $size: { $ifNull: ['$tags', []] } },
        score_locations: {
          $multiply: [
            {
              $size: {
                $setIntersection: [similarDocs?.similarLocations || [], { $ifNull: ['$preferences.locations', []] }],
              },
            },
            2,
          ],
        },
        score_paymentType: { $cond: [{ $eq: ['$payment.type', freelancer?.expectedPaymentType] }, 1, 0] },
        score_paymentAmount: {
          $cond: [
            {
              $and: [
                {
                  $gte: [
                    '$payment.amount',
                    freelancer?.expectedAmount ? freelancer.expectedAmount - freelancer.expectedAmount / 4.3 : 0,
                  ],
                },
                {
                  $lte: [
                    '$payment.amount',
                    freelancer?.expectedAmount ? freelancer.expectedAmount + freelancer.expectedAmount / 4.3 : 0,
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
        score_expertise: {
          $cond: [
            {
              $and: [
                {
                  $gte: ['$complexity', freelancer?.expertiseLevel ? freelancer.expertiseLevel - 1 : 0],
                },
                {
                  $lte: ['$complexity', freelancer?.expertiseLevel ? freelancer.expertiseLevel + 1 : 0],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        totalScore: {
          $add: [
            '$score_title',
            '$score_description',
            '$score_categories',
            '$score_skills',
            '$score_locations',
            '$score_paymentType',
            '$score_paymentAmount',
            // '$score_suit_skills',
            '$score_paymentType',
            '$score_paymentAmount',
            '$score_expertise',
          ],
        },
      },
    },
    { $project: projectFields },

    { $sort: { totalScore: -1 as any } },
  ]

  const sortOptions = {}
  const [sortField, sortOrder] = options?.sortBy ? options.sortBy.split(':') : 'totalScore:desc'.split(':')
  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1

  filterPipeline.push({ $sort: sortOptions })

  const skip = ((options?.page || 1) - 1) * (options?.limit || 10)
  filterPipeline.push({ $skip: skip })
  filterPipeline.push({ $limit: options?.limit || 10 })

  const jobs = await Job.aggregate(filterPipeline)

  const fullfillJobs = await Job.populate(jobs, populateFields)

  const totalResults = await Job.countDocuments({ isDeleted: { $ne: true } })

  const queryReSults: QueryResult = {
    results: fullfillJobs,
    totalResults,
    totalPages: Math.ceil(totalResults / (options?.limit || 10)),
    limit: options?.limit || 10,
    page: options?.page || 1,
  }

  return queryReSults
}

/**
 * @returns {Promise<IJobDoc | null>}
 */
export const getAllJob = async (): Promise<IJobDoc[] | null> => {
  const jobs = await Job.find()
    .select(
      'client categories title description locations complexity payment budget createdAt nOProposals nOEmployee preferences reqSkills'
    )
    .populate([{ path: 'client', select: 'rating spent paymentVerified' }, { path: 'categories' }])
    .sort({ updatedAt: 1 })
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found freelancer')
  }

  const filter = { _id: { $in: freelancer?.favoriteJobs || [] } }

  options.sortBy = 'updatedAt:desc'
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
export const getSimilarJobs = async (
  jobId: mongoose.Types.ObjectId,
  options: IOptions,
  freelancer?: IFreelancerDoc | null
): Promise<QueryResult> => {
  const job = await Job.findById(jobId).lean()

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found job')
  }

  let filterByFreelancer = []

  if (freelancer) {
    filterByFreelancer.push({ appliedFreelancers: { $nin: [freelancer?._id] } })
    filterByFreelancer.push({ blockFreelancers: { $nin: [freelancer?._id] } })
    if (freelancer?.jobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.jobs } })
    }
    if (freelancer?.favoriteJobs?.length) {
      filterByFreelancer.push({ _id: { $nin: freelancer?.favoriteJobs?.map(j => j?.toString()) } })
    }
  }

  filterByFreelancer = filterByFreelancer?.length ? filterByFreelancer : []

  let keyWords

  if (job?.title) {
    keyWords = extractKeywords(
      `${`${job?.title} ${job?.description} ${job?.checkLists?.map(c => c).join(' ')} ${job?.questions
        ?.map(c => c)
        .join(' ')}`}`
    )
  }

  const regexPattern = createFuzzyRegex(keyWords)

  const similarRegex = new RegExp(regexPattern, 'gi')

  const filter = {
    $and: [
      {
        $or: [
          { title: { $regex: similarRegex } },
          { description: { $regex: similarRegex } },
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
      ...filterByFreelancer,
      { isDeleted: { $ne: true } },
      { currentStatus: { $in: [EJobStatus.OPEN] } },
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
// export const softDeleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
//   const job = await Job.findById(jobId)
//     .populate({
//       path: 'proposals',
//       select: 'freelancer',
//       populate: {
//         path: 'freelancer.user',
//         select: '_id',
//       },
//     })
//     .populate({
//       path: 'client',
//       select: 'user',
//       populate: {
//         path: 'user',
//         select: '_id',
//       },
//     })

//   if (!job) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
//   }

//   const clientUserId = job.client?.user?._id

//   if (job.proposals?.length) {
//     const userUpdates = [
//       { filter: { _id: clientUserId }, update: { $inc: { sickPoints: 2 } } },
//       ...job.proposals.map(proposal => ({
//         filter: { _id: proposal.freelancer.user._id },
//         update: { $inc: { sickPoints: proposal.sickUsed || 2 } },
//       })),
//     ]

//     await Promise.all([
//       User.updateOne({ _id: clientUserId }, { $inc: { sickPoints: -2 } }),
//       ...userUpdates.map(update => User.updateOne(update.filter, update.update)),
//       ...job.proposals.map(proposal =>
//         createNotify({
//           to: proposal.freelancer.user._id,
//           path: FERoutes.allProposals + (proposal._id || ''),
//           attachedId: proposal._id,
//           content: FEMessage(job.title).rejectProposalDueJobDeleted,
//         })
//       ),
//     ])
//   }

//   job.isDeleted = true
//   job.status?.push({
//     status: EJobStatus.CANCELLED,
//     comment: 'the job is deleted by its owner',
//     date: new Date(),
//   })

//   await job.save()

//   return job
// }

export const softDeleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
  const job = await Job.findById(jobId)
    .populate({
      path: 'proposals',
      select: 'freelancer',
      populate: {
        path: 'freelancer.user',
        select: '_id',
      },
    })
    .populate({
      path: 'client',
      select: 'user',
      populate: {
        path: 'user',
        select: '_id',
      },
    })

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }

  const clientUserId = job.client?.user?._id

  if (job.proposals?.length) {
    const bulkOperations = [
      { updateOne: { filter: { _id: clientUserId }, update: { $inc: { sickPoints: 2 } } } },
      ...job.proposals.map(proposal => ({
        updateOne: {
          filter: { _id: proposal.freelancer.user._id },
          update: { $inc: { sickPoints: proposal.sickUsed || 2 } },
        },
      })),
    ]

    const notifyBodies = job.proposals.map(proposal => ({
      to: proposal.freelancer.user._id,
      path: FERoutes.allProposals + (proposal._id || ''),
      attachedId: proposal._id,
      content: FEMessage(job.title).rejectProposalDueJobDeleted,
    }))

    await Promise.all([
      User.updateOne({ _id: clientUserId }, { $inc: { sickPoints: -2 } }),
      User.bulkWrite(bulkOperations),
      bulkCreateNotify(notifyBodies),
      updateProposalStatusBulk(
        job.proposals.map(p => p._id),
        EStatus.CANCELLED,
        'the job is deleted by its owner'
      ),
    ])
  }

  job.isDeleted = true
  job.status?.push({
    status: EJobStatus.CANCELLED,
    comment: 'the job is deleted by its owner',
    date: new Date(),
  })

  await job.save()

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
  status: EJobStatus,
  comment: string
): Promise<IJobDoc | null> => {
  const job = await getJobById(jobId)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  if (!job?.status?.length) {
    job.status = [
      {
        status,
        comment,
        date: new Date(),
      },
    ]
  }

  job.status?.push({
    status,
    comment,
    date: new Date(),
  })
  await job.save()
  return job
}

/**
 * Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const getAllJobs = async (filter: Record<string, any>, options: IOptions): Promise<IJobDoc[]> => {
  const jobs = await Job.find()
    .populate([
      { path: 'client' },
      { path: 'categories' },
      { path: 'reqSkills.skill' },
      { path: 'proposals', populate: 'freelancer' },
    ])
    .lean()
  return jobs
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
