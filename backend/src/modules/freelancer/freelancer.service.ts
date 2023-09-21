import { IReview } from 'common/interfaces/subInterfaces'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IFreelancerDoc, NewRegisteredFreelancer, UpdateFreelancerBody } from './freelancer.interfaces'
import Freelancer from './freelancer.model'

/**
 * Register a freelancer
 * @param {NewRegisteredFreelancer} freelancerBody
 * @returns {Promise<IFreelancerDoc>}
 */
export const registerFreelancer = async (freelancerBody: NewRegisteredFreelancer): Promise<IFreelancerDoc> => {
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
  Freelancer.findOne({ user: userId })

/**
 * Get freelancer by freelancername
 * @param {string} freelancername
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByFreelancerName = async (freelancername: string): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ freelancername })

/**
 * Get freelancer by email
 * @param {string} email
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByEmail = async (email: string): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne({ email })

/**
 * Get freelancer by option
 * @param {object} options
 * @returns {Promise<IFreelancerDoc | null>}
 */
export const getFreelancerByOptions = async (Options: any): Promise<IFreelancerDoc | null> =>
  Freelancer.findOne(Options)

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
