import httpStatus from 'http-status'
import mongoose from 'mongoose'
import Client from './client.model'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { UpdateClientBody, IClientDoc, NewRegisteredClient } from './client.interfaces'

/**
 * Register a client
 * @param {NewRegisteredClient} clientBody
 * @returns {Promise<IClientDoc>}
 */
export const registerClient = async (clientBody: NewRegisteredClient): Promise<IClientDoc> => {
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
