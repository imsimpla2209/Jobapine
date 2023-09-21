import httpStatus from 'http-status'
import mongoose from 'mongoose'
import Contract from './contract.model'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { UpdateContractBody, IContractDoc, NewCreatedContract } from './contract.interfaces'

/**
 * Register a contract
 * @param {NewCreatedContract} contractBody
 * @returns {Promise<IContractDoc>}
 */
export const createContract = async (contractBody: NewCreatedContract): Promise<IContractDoc> => {
  // if (await Contract.isUserSigned(contractBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Contract')
  // }
  return Contract.create(contractBody)
}

/**
 * Query for contracts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryContracts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const contracts = await Contract.paginate(filter, options)
  return contracts
}

/**
 * Get contract by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractById = async (id: mongoose.Types.ObjectId): Promise<IContractDoc | null> =>
  Contract.findById(id)

/**
 * Get contract by contractname
 * @param {string} contractname
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractByContractname = async (contractname: string): Promise<IContractDoc | null> =>
  Contract.findOne({ contractname })

/**
 * Get contract by email
 * @param {string} email
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractByEmail = async (email: string): Promise<IContractDoc | null> => Contract.findOne({ email })

/**
 * Get contract by option
 * @param {object} options
 * @returns {Promise<IContractDoc | null>}
 */
export const getContractByOptions = async (Options: any): Promise<IContractDoc | null> => Contract.findOne(Options)

/**
 * Update contract by id
 * @param {mongoose.Types.ObjectId} contractId
 * @param {UpdateContractBody} updateBody
 * @returns {Promise<IContractDoc | null>}
 */
export const updateContractById = async (
  contractId: mongoose.Types.ObjectId,
  updateBody: UpdateContractBody
): Promise<IContractDoc | null> => {
  const contract = await getContractById(contractId)
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found')
  }
  Object.assign(contract, updateBody)
  await contract.save()
  return contract
}

/**
 * Delete contract by id
 * @param {mongoose.Types.ObjectId} contractId
 * @returns {Promise<IContractDoc | null>}
 */
export const deleteContractById = async (contractId: mongoose.Types.ObjectId): Promise<IContractDoc | null> => {
  const contract = await getContractById(contractId)
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found')
  }
  await contract.deleteOne()
  return contract
}

/**
 * Delete contract by options
 * @param {any} options
 * @returns {Promise<void>}
 */
export const deleteContractByOptions = async (options: any): Promise<void> => {
  await Contract.deleteOne(options)
}
