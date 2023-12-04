/* eslint-disable prefer-const */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-computed-key */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import queryGen from '@core/libs/queryGennerator'
import { IJobDoc } from '@modules/job/job.interfaces'
import { JobCategory, JobTag } from '@modules/job/job.model'
import { addApplytoJobById, getJobById, getJobsByOptions } from '@modules/job/job.service'
import { Skill } from '@modules/skill'
import { IReview } from 'common/interfaces/subInterfaces'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import keywordExtractor from 'keyword-extractor'
import { union } from 'lodash'
import mongoose from 'mongoose'
import { createFuzzyRegex, extractKeywords } from 'utils/helperFunc'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import {
  IFreelancerDoc,
  ISimilarFreelancer,
  NewRegisteredFreelancer,
  UpdateFreelancerBody,
} from './freelancer.interfaces'
import Freelancer, { SimilarFreelancer } from './freelancer.model'
import { createNotify } from '@modules/notify/notify.service'
import { FEMessage } from 'common/enums/constant'

/**
 * Register a freelancer
 * @param {mongoose.Types.ObjectId} freelancerBody
 * @param {NewRegisteredFreelancer} freelancerBody
 * @returns {Promise<IFreelancerDoc>}
 */
export const registerFreelancer = async (
  userId: mongoose.Types.ObjectId,
  freelancerBody: NewRegisteredFreelancer
): Promise<IFreelancerDoc> => {
  // const user = await getUserById(userId)
  // if (!user.isVerified) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, `User is not verified`)
  // }
  if (await Freelancer.findOne({ user: freelancerBody.user })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Freelancer')
  }
  let profileCompletion = 0
  if (freelancerBody?.skills?.length > 0) profileCompletion += 10
  if (freelancerBody?.preferJobType?.length > 0) profileCompletion += 10
  if (freelancerBody?.intro) profileCompletion += 10
  return Freelancer.create({ ...freelancerBody, profileCompletion })
}

/**
 * Query for freelancers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryFreelancers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const freelancers = await Freelancer.paginate(filter, options)
  return freelancers
}

/**
 * Advanced Query for freelancers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAdvancedFreelancers = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  filter['name'] && (filter['name'] = { $search: `${filter['name']}`, $diacriticSensitive: true })
  if (filter['id']?.length) {
    console.log('😘', filter)

    filter['_id'] = { $in: filter['id'] }
    delete filter['id']
  }
  filter['intro'] && (filter['intro'] = { $regex: `${filter['intro']}`, $options: 'i' })

  if (filter['skills']) {
    filter['skills.skill'] = { $in: filter['skills'].map(item => new mongoose.Types.ObjectId(item)) }
    delete filter['skills']
  }

  filter['preferJobType'] && (filter['preferJobType'] = { $in: filter['preferJobType'] })
  filter['currentLocations'] && (filter['currentLocations'] = { $in: filter['currentLocations'] })
  filter['categories'] && (filter['categories'] = { $in: filter['categories'] })
  filter['tags'] && (filter['tags'] = { $in: filter['tags'] })

  filter['jobsDone.number'] &&
    (filter['jobsDone.number'] = queryGen.numRanges(filter['jobsDone.number']?.from, filter['jobsDone.number']?.to))
  filter['jobsDone.success'] &&
    (filter['jobsDone.success'] = queryGen.numRanges(filter['jobsDone.success']?.from, filter['jobsDone.success']?.to))
  filter['earned'] && (filter['earned'] = queryGen.numRanges(filter['earned']?.from, filter['earned']?.to))
  filter['rating'] && (filter['rating'] = queryGen.numRanges(filter['rating']?.from, filter['rating']?.to))

  options.populate = 'user,preferJobType,skills.skill'
  if (!options.projectBy) {
    options.projectBy = 'user, name, intro, members, skills, currentLocations, rating, jobsDone, available, earned'
  }
  const freelancers = await Freelancer.paginate(filter, options)
  return freelancers
}

/**
 * search freelancers by text
 * @param {string} searchText - text
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const searchFreelancersByText = async (searchText: string, options: IOptions): Promise<QueryResult> => {
  const foundCats = await JobCategory.find({ name: { $regex: searchText, $options: 'i' } })
  const foundSkills = await Skill.find({ name: { $regex: searchText, $options: 'i' } })

  const filter = {
    $and: [
      {
        $or: [
          { name: { $search: searchText, $diacriticSensitive: true } },
          { intro: { $regex: searchText, $options: 'i' } },
          { preferJobType: { $in: foundCats || [] } },
          { 'skills.skill': { $in: foundSkills || [] } },
        ],
      },
      { isDeleted: { $ne: true } },
    ],
  }

  options.populate = 'user,preferJobType,skills.skill'
  if (!options.projectBy) {
    options.projectBy =
      'user, name, intro, members, skills.skill, preferJobType, currentLocations, rating, jobsDone, available, earned'
  }

  const jobs = await Freelancer.paginate(filter, options)
  return jobs
}

/**
 * manually get recommended freelancer based on job(low level vcl)
 * @param {string} jobId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
export const getRcmdFreelancers = async (jobId: mongoose.Types.ObjectId, options: IOptions): Promise<QueryResult> => {
  // const similarDocs = await getSimilarsByOptions(freelancerId)
  const job = await getJobById(jobId)

  let keyWords

  if (job.description) {
    keyWords = keywordExtractor.extract(job.description, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    })

    keyWords = keyWords.map(k => `.*${k}.*`).join('|')
  }

  keyWords.concat(
    keywordExtractor
      .extract(job.title, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      })
      .map(k => `.*${k}.*`)
      .join('|')
  )

  keyWords = new RegExp(keyWords, 'i')

  const filter = {
    $or: [
      { intro: { $regex: keyWords, $options: 'i' } },
      { preferJobType: { $in: job.categories || [] } },
      { skills: { $in: job.reqSkills || [] } },
      // { tags: { $in: similarDocs.similarTags || [] } },
      { currentLocations: { $in: job.preferences?.locations || [] } },
      { member: { $gte: job.preferences?.nOEmployee } },
    ],
  }

  const ids = await SimilarFreelancer.find(filter)

  const queryFilter = { _id: { $in: ids } }

  options.populate = 'user,preferJobType,skills.skill'
  options.limit = 30
  if (!options.projectBy) {
    options.projectBy =
      'user, name, intro, members, skills.skill, preferJobType, currentLocations, rating, jobsDone, available, earned'
  }

  const freelancers = await Freelancer.paginate(queryFilter, options)
  return freelancers
}

/**
 * Get freelancer by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerById = async (id: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> =>
  Freelancer.findById(id).populate('skills.skill').populate('preferJobType')

/**
 * Get freelancer by id with populate
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByIdWithPopulate = async (
  id: mongoose.Types.ObjectId,
  populate?: string[]
): Promise<IFreelancerDoc | null> =>
  Freelancer.findById(id).populate(['user', 'preferJobType', 'skills.skill', 'proposals'])

/**
 * Get freelancer by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByUserId = async (userId: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ user: userId, isDeleted: { $ne: true } })

/**
 * Get freelancer by freelancername
 * @param {string} freelancername
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByFreelancerName = async (freelancername: string): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ freelancername, isDeleted: { $ne: true } })

/**
 * Get freelancer by email
 * @param {string} email
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByEmail = async (email: string): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ email, isDeleted: { $ne: true } })

/**
 * Get freelancer by option
 * @param {object} options
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByOptions = async (Options: any): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ ...Options, isDeleted: { $ne: true } })
    .lean()
    .populate('preferJobType')
    .populate('skills.skill')
    .exec()

/**
 * Update freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {UpdateFreelancerBody} updateBody
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const updateFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId,
  updateBody: UpdateFreelancerBody
): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  Object.assign(freelancer, updateBody)
  await freelancer.save()
  return freelancer
}

/**
 * Verify freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {UpdateFreelancerBody} updateBody
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const verifyFreelancerById = async (freelancerId: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> => {
  const freelancer = await Freelancer.findById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  Object.assign(freelancer, {
    isProfileVerified: true,
  })
  createNotify({
    to: freelancer?.user,
    path: `/profile/me`,
    content: FEMessage().profileVerified,
  })
  await freelancer.save()
  return freelancer
}

/**
 * create freelancer profile by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {UpdateFreelancerBody} updateBody
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const createFreelancerProfileById = async (
  freelancerId: mongoose.Types.ObjectId,
  updateBody: UpdateFreelancerBody
): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  const requiredFields = [
    'title',
    'intro',
    'skills',
    'preferJobType',
    'currentLocations',
    'available',
    'expertiseLevel',
    'education',
    'historyWork',
    'englishProficiency',
    'otherLanguages',
    'expectedAmount',
    'expectedPaymentType',
  ]
  let completion = 0
  requiredFields.forEach(field => {
    if (updateBody && updateBody[field]) {
      completion += 1
    }
  })
  const totalFields = requiredFields.length
  const profileCompletionPercent = (completion / totalFields) * 100
  const projectCompletionPercent = Math.max(10, Math.min(100, profileCompletionPercent))
  if (!updateBody['profileCompletion']) {
    updateBody['profileCompletion'] = projectCompletionPercent
  }
  if (!updateBody['isSubmitProfile']) {
    updateBody['isSubmitProfile'] = true
  }
  Object.assign(freelancer, updateBody)
  await freelancer.save()
  return freelancer
}

/**
 * Delete freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const deleteFreelancerById = async (freelancerId: mongoose.Types.ObjectId): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  await freelancer.deleteOne()
  return freelancer
}

/**
 * review freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {IReview} review
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const reviewFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId,
  review: IReview
): Promise<IFreelancerDoc | null> => {
  const freelancer = await getFreelancerById(freelancerId)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  Object.assign(freelancer, { review: freelancer?.reviews?.push(review) })
  await freelancer.save()
  return freelancer
}

/**
 * add proposals to freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @param {String} proposalId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const addProposaltoFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId,
  proposalId: string
): Promise<IFreelancerDoc | null> => {
  try {
    const freelancer = await Freelancer.findOneAndUpdate({ _id: freelancerId }, { $push: { proposals: proposalId } })
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    return freelancer
  } catch (err) {
    throw new Error(`cannot add proposals to freelancer ${err}`)
  }
}

export const updateSimilarData = (
  freelancerJobs: IJobDoc[] = [],
  foundCats: any[] = [],
  foundSkills: any[] = [],
  preferLocation: any[] = [],
  newDescription = '',
  similarClients: any[] = []
) => {
  const updatedData = {
    foundCats,
    foundSkills,
    foundLocations: preferLocation,
    newDescription,
    foundClients: similarClients,
  }

  freelancerJobs.forEach(job => {
    if (job?.categories?.length) {
      updatedData.foundCats = union(
        updatedData.foundCats,
        job.categories.map(c => c?._id)
      )
    }
    if (job?.reqSkills?.length) {
      updatedData.foundSkills = union(
        updatedData.foundSkills,
        job.reqSkills.map(c => c?.skill?._id)
      )
    }
    if (job?.preferences?.locations?.length) {
      updatedData.foundLocations = union(updatedData.foundLocations, job.preferences.locations)
    }
    updatedData.newDescription += `${job?.description} ${job?.title}`
    updatedData.foundClients = union(updatedData.foundClients, [job?.client?._id || job?.client])
  })

  return updatedData
}

/**
 * update similar info for freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const updateSimilarById = async (freelancerId: mongoose.Types.ObjectId): Promise<any | null> => {
  try {
    const freelancer = await Freelancer.findById(freelancerId)
      .populate(['favoriteJobs'])
      .populate(['jobs'])
      .populate({
        path: 'proposals',
        populate: { path: 'job' },
      })
      .populate({
        path: 'relevantClients',
        populate: { path: 'jobs' },
      })
      .lean()

    if (!freelancer) {
      throw new Error('Freelancer not found')
    }

    let initialSimilarDocs: any = {
      foundJobs: [],
      foundClients: [],
      foundLocations: [],
      foundCats: [],
      foundSkills: [],
      newDescription: '',
    }

    initialSimilarDocs.foundLocations = freelancer?.currentLocations

    initialSimilarDocs.foundClients = union(
      freelancer?.relevantClients?.map(c => c?._id) || [],
      freelancer?.favoriteClients || []
    )

    initialSimilarDocs.foundCats = union(initialSimilarDocs.foundCats, freelancer?.preferJobType)
    initialSimilarDocs.foundSkills = union(
      initialSimilarDocs.foundSkills,
      freelancer?.skills.map(sk => sk.skill)
    )

    let similarJobs: any[] = []

    if (freelancer?.jobs?.length) {
      similarJobs = union(similarJobs, [...freelancer.jobs])
    }
    if (freelancer?.proposals?.length) {
      const appliedJobs = freelancer.proposals.map(p => p.job)
      similarJobs = union(similarJobs, [...appliedJobs])
    }
    if (freelancer?.favoriteJobs) {
      similarJobs = union(similarJobs, [...freelancer.favoriteJobs])
    }
    if (freelancer?.relevantClients) {
      const freelancerJobs = await getJobsByOptions({ client: { $in: freelancer?.relevantClients?.map(c => c?._id) } })
      similarJobs = union(similarJobs, [...freelancerJobs])
      freelancer?.relevantClients?.forEach(e => {
        e?.preferJobType?.forEach(c => {
          if (!initialSimilarDocs.foundCats?.includes(c)) {
            initialSimilarDocs.foundCats.push(c)
          }
        })
        similarJobs = union(similarJobs, e?.jobs)

        initialSimilarDocs.foundLocations = union(initialSimilarDocs.foundLocations, e?.preferLocations)
        initialSimilarDocs.newDescription += `${e?.intro}`
      })
    }

    initialSimilarDocs = updateSimilarData(
      similarJobs,
      initialSimilarDocs.foundCats,
      initialSimilarDocs.foundSkills,
      initialSimilarDocs.foundLocations,
      initialSimilarDocs.newDescription,
      initialSimilarDocs.foundClients
    )

    const keyWords = extractKeywords(`${freelancer?.intro} ${initialSimilarDocs.newDescription}`)

    logger.info('Extracted Keywords', keyWords)

    // const regexPattern = keyWords
    //   ?.map(keyword => {
    //     const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    //     return `(${escapedKeyword})`
    //   })
    //   .join('|')

    // const similarRegex = new RegExp(regexPattern, 'gi')

    const similarRegex = createFuzzyRegex(keyWords)

    const foundExtraCats: any[] = await JobCategory.find({ name: { $regex: `${similarRegex}`, $options: 'si' } })
    const foundExtraSkills: any[] = (await Skill.find({ name: { $regex: `${similarRegex}`, $options: 'si' } })) || []

    const extraSimilarSkills = await Promise.all(
      initialSimilarDocs.foundSkills?.filter(sk => sk?.category)?.map(sk => Skill.find({ category: sk?.category }))
    )

    const foundTags = await JobTag.find({ name: { $regex: `${similarRegex}`, $options: 'si' } })

    initialSimilarDocs.foundCats = union(initialSimilarDocs.foundCats, foundExtraCats?.map(c => c?._id) || [])

    initialSimilarDocs.foundSkills = union(
      initialSimilarDocs.foundSkills || [],
      foundExtraSkills?.map(sk => sk?._id) || [],
      [].concat(...extraSimilarSkills)?.map(sk => sk?._id)
    )

    logger.info('Similar Doc', initialSimilarDocs)

    let similarDoc = await SimilarFreelancer.findOne({
      freelancer: freelancer._id,
    })
    if (similarDoc) {
      similarDoc.similarJobCats = union(
        initialSimilarDocs.foundCats?.filter(c => !!c),
        similarDoc?.similarJobCats || []
      )
      similarDoc.similarSkills = union(
        initialSimilarDocs.foundSkills?.filter(s => !!s),
        similarDoc?.similarSkills || []
      )
      similarDoc.similarLocations = union(similarDoc.similarLocations, initialSimilarDocs?.foundLocations || [])
      similarDoc.similarKeys = similarRegex?.toString()
      similarDoc.similarClients = union(initialSimilarDocs.foundClients, similarDoc?.similarClients || [])
    } else if (!similarDoc) {
      similarDoc = new SimilarFreelancer({
        freelancer: freelancer._id,
        similarKeys: similarRegex?.toString(),
        similarJobCats: initialSimilarDocs.foundCats?.filter(c => !!c),
        similarLocations: initialSimilarDocs?.foundLocations,
        similarSkills: initialSimilarDocs.foundSkills?.filter(s => !!s),
        similarTags: foundTags || [],
        similarClients: initialSimilarDocs.foundClients,
      })
    }

    await similarDoc.save()

    return similarDoc
  } catch (error: any) {
    logger.error(`update similar freelancer Doc error ${error?.message}`)
    throw new ApiError(httpStatus.BAD_GATEWAY, `update similar freelancer Doc error ${error?.message}`)
  }
}

/**
 * Update apply job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @param {string} freelancerId
 * @param {string} clientId
 * @returns {Promise<IJobDoc | null>}
 */
export const addJobtoFreelancer = async (
  jobId: mongoose.Types.ObjectId,
  freelancerId: mongoose.Types.ObjectId,
  clientId: mongoose.Types.ObjectId
): Promise<IFreelancerDoc | null> => {
  try {
    addApplytoJobById(jobId, freelancerId.toString())
    const freelancer = await getFreelancerById(new mongoose.Types.ObjectId(freelancerId))
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'freelancer not found')
    }
    const jobs = freelancer?.jobs ? [...freelancer.jobs, jobId] : [jobId]
    const relevantClients = freelancer?.relevantClients ? [...freelancer.relevantClients, clientId] : [clientId]
    freelancer.jobsDone.number = (freelancer?.jobsDone?.number ?? 0) + 1
    freelancer['jobs'] = jobs
    freelancer['relevantClients'] = relevantClients

    await freelancer.save()

    return freelancer
  } catch (err) {
    throw new Error('cannot add job to freelancer')
  }
}

/**
 * Get similar by freelancer id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getSimilarByFreelancerId = async (id: mongoose.Types.ObjectId): Promise<ISimilarFreelancer | null> =>
  SimilarFreelancer.findOne({ freelancer: id })

/**
 * Get similars by options
 * @param {any} options
 * @returns {Promise<IFreelancerDoc | null>}
 */
export async function getSimilarsByOptions(options: any): Promise<ISimilarFreelancer[] | null> {
  return SimilarFreelancer.find(options)
}

/**
 * Soft Delete freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const softDeleteFreelancerById = async (
  freelancerId: mongoose.Types.ObjectId
): Promise<IFreelancerDoc | null> => {
  const freelancer = await Freelancer.findByIdAndUpdate(freelancerId, { isDeleted: true })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  return freelancer
}
