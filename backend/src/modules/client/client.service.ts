/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import queryGen from '@core/libs/queryGennerator'
import { IReview } from 'common/interfaces/subInterfaces'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IClientDoc, NewRegisteredClient, UpdateClientBody } from './client.interfaces'
import Client from './client.model'

/**
 * Register a client
 * @param {NewRegisteredClient} clientBody
 * @returns {Promise<IClientDoc>}
 */
export const registerClient = async (
  userId: mongoose.Types.ObjectId,
  clientBody: NewRegisteredClient
): Promise<IClientDoc> => {
  // const user = await getUserById(userId)
  // if (!user.isVerified) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, `User is not verified`)
  // }
  if (await Client.isUserSigned(clientBody.user)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Client')
  }
  return Client.create(clientBody)
}

/**
 * Query for clients
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryClients = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['name'] && (filter['name'] = { $search: `${filter['name']}`, $diacriticSensitive: true })
  filter['intro'] = { $regex: `${filter['name']}`, $options: 'i' }

  filter['rating'] && (filter['rating'] = queryGen.numRanges(filter['rating']?.from, filter['rating']?.to))
  const clients = await Client.paginate(filter, options)
  return clients
}

/**
 * Get client by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientById = async (id: mongoose.Types.ObjectId): Promise<IClientDoc | null> => Client.findById(id)

/**
 * Get client by clientname
 * @param {string} clientname
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientByClientname = async (clientname: string): Promise<IClientDoc | null> =>
  Client.findOne({ clientname })

/**
 * Get client by email
 * @param {string} email
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientByEmail = async (email: string): Promise<IClientDoc | null> => Client.findOne({ email })

/**
 * Get client by option
 * @param {object} options
 * @returns {Promise<IClientDoc | null>}
 */
export const getClientByOptions = async (Options: any): Promise<IClientDoc | null> => Client.findOne(Options)

/**
 * Update client by id
 * @param {mongoose.Types.ObjectId} clientId
 * @param {UpdateClientBody} updateBody
 * @returns {Promise<IClientDoc | null>}
 */
export const updateClientById = async (
  clientId: mongoose.Types.ObjectId,
  updateBody: UpdateClientBody
): Promise<IClientDoc | null> => {
  const client = await getClientById(clientId)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  Object.assign(client, updateBody)
  await client.save()
  return client
}

/**
 * Delete client by id
 * @param {mongoose.Types.ObjectId} clientId
 * @returns {Promise<IClientDoc | null>}
 */
export const deleteClientById = async (clientId: mongoose.Types.ObjectId): Promise<IClientDoc | null> => {
  const client = await getClientById(clientId)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  await client.deleteOne()
  return client
}

/**
 * Soft Delete client by id
 * @param {mongoose.Types.ObjectId} freelancerId
 * @returns {Promise<IClientDoc | null>}
 */
export const softDeleteClientById = async (freelancerId: mongoose.Types.ObjectId): Promise<IClientDoc | null> => {
  const freelancer = await Client.findByIdAndUpdate(freelancerId, { isDeleted: true })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  return freelancer
}

/**
 * review client by id
 * @param {mongoose.Types.ObjectId} clientId
 * @param {IReview} review
 * @returns {Promise<IClientDoc | null>}
 */
export const reviewClientById = async (
  clientId: mongoose.Types.ObjectId,
  review: IReview
): Promise<IClientDoc | null> => {
  const client = await getClientById(clientId)
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
  }
  Object.assign(client, { review: client?.reviews?.push(review) })
  await client.save()
  return client
}
