/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-computed-key */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import queryGen from '@core/libs/queryGennerator'
import { JobCategory, JobTag } from '@modules/job/job.model'
import { addApplytoJobById, getJobById, getJobsByOptions } from '@modules/job/job.service'
import { Skill } from '@modules/skill'
import { IReview } from 'common/interfaces/subInterfaces'
import httpStatus from 'http-status'
import keywordExtractor from 'keyword-extractor'
import { union } from 'lodash'
import mongoose from 'mongoose'
import { IJobDoc } from '@modules/job/job.interfaces'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import {
  IFreelancerDoc,
  ISimilarFreelancer,
  NewRegisteredFreelancer,
  UpdateFreelancerBody,
} from './freelancer.interfaces'
import Freelancer, { SimilarFreelancer } from './freelancer.model'

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
  return Freelancer.create(freelancerBody)
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
  filter['intro'] && (filter['intro'] = { $regex: `${filter['intro']}`, $options: 'i' })

  filter['skills'] && (filter['skills'] = { $in: filter['skills'] })
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
    options.projectBy =
      'user, name, intro, members, skills.skill, preferJobType, currentLocations, rating, jobsDone, available, earned'
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
  Freelancer.findById(id)

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
  freelancerJobs?: IJobDoc[],
  foundCats?: any[],
  foundSkills?: any[],
  preferLocation?: any[],
  newDescription?: string
) => {
  if (freelancerJobs) {
    freelancerJobs.forEach(j => {
      j?.categories?.forEach(c => {
        if (!foundCats?.includes(c?._id)) {
          foundCats.push(c?._id)
        }
      })
      j?.reqSkills?.forEach(c => {
        if (!foundSkills?.includes(c?.skill?._id)) {
          foundCats.push(c?.skill?._id)
        }
      })
      j?.preferences?.locations?.forEach(l => {
        if (!preferLocation?.includes(l)) {
          preferLocation?.push(l)
        }
      })
      newDescription += `${j?.description} ${j?.title}`
    })
  }
}

/**
 * update similar info for freelancer by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const updateSimilarById = async (freelancerId: mongoose.Types.ObjectId): Promise<any | null> => {
  try {
    const freelancer = await Freelancer.findById(freelancerId)
      .populate(['favoriteJobs', 'proposals'])
      .populate({
        path: 'relevantClients',
        populate: { path: 'jobs' },
      })
      .lean()

    if (!freelancer) {
      throw new Error('Freelancer not found')
    }

    let keyWords

    if (freelancer?.intro) {
      keyWords = keywordExtractor.extract(freelancer?.intro, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      })

      keyWords = keyWords.map(k => `.*${k}.*`).join('|')
      keyWords = new RegExp(keyWords, 'i')
    }

    let newDescription

    let foundCats = await JobCategory.find({ name: { $regex: `${keyWords}`, $options: 'si' } })
    let foundSkills = (await Skill.find({ name: { $regex: `${keyWords}`, $options: 'si' } })) || []

    freelancer?.skills.forEach(async sk => {
      const skill = await Skill.findById(sk.skill)
      foundSkills.push(skill)
    })

    const extraSimilarSkills = await Promise.all(foundSkills.map(sk => Skill.find({ category: sk?.category })))

    const foundTags = await JobTag.find({ name: { $regex: `${keyWords}`, $options: 'si' } })

    foundCats = union(
      foundCats?.map(c => c?._id),
      freelancer?.preferJobType
    )
    foundSkills = union(
      foundSkills?.map(sk => sk._id),
      freelancer?.skills.map(sk => sk.skill),
      [].concat(...extraSimilarSkills)?.map(sk => sk._id)
    )

    const preferLocation = freelancer?.currentLocations || []

    if (freelancer?.jobs?.length) {
      const freelancerJobs = await getJobsByOptions({ appliedFreelancers: { $in: freelancer?._id } })
      updateSimilarData(freelancerJobs, foundCats, foundSkills, newDescription)
    }
    if (freelancer?.proposals?.length) {
      const freelancerJobs = await getJobsByOptions({
        appliedFreelancers: { $in: freelancer?.proposals?.map(p => p.job) },
      })
      updateSimilarData(freelancerJobs, foundCats, foundSkills, newDescription)
    }
    if (freelancer?.favoriteJobs) {
      updateSimilarData(freelancer?.favoriteJobs, foundCats, foundSkills, newDescription)
    }
    if (freelancer?.relevantClients) {
      const freelancerJobs = await getJobsByOptions({ client: { $in: freelancer?.relevantClients?.map(c => c?._id) } })
      updateSimilarData(freelancerJobs, foundCats, foundSkills, newDescription)
      freelancer?.relevantClients?.forEach(e => {
        e?.preferJobType?.forEach(c => {
          if (!foundCats?.includes(c)) {
            foundCats.push(c)
          }
        })
        updateSimilarData(e?.jobs, foundCats, foundSkills, newDescription)

        e?.preferLocations?.forEach(l => {
          if (!preferLocation?.includes(l)) {
            preferLocation?.push(l)
          }
        })
        newDescription += `${e?.intro}`
      })
    }

    keyWords = keywordExtractor.extract(`${freelancer?.intro} ${newDescription}`, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    })

    keyWords = keyWords.map(k => `.*${k}.*`).join('|')
    keyWords = new RegExp(keyWords, 'i')

    const similarDoc = new SimilarFreelancer({
      freelancer: freelancer._id,
      similarKeys: keyWords || '',
      similarJobCats: foundCats || [],
      similarLocations: preferLocation,
      similarSkills: foundSkills || [],
      similarTags: foundTags || [],
      similarClients: [],
    })

    similarDoc.save()

    return freelancer
  } catch (error) {
    throw new ApiError(httpStatus.BAD_GATEWAY, `similar error ${error}`)
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
