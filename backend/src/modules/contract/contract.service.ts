import { getClientById } from '@modules/client/client.service'
import { getFreelancerById } from '@modules/freelancer/freelancer.service'
import { getJobById } from '@modules/job/job.service'
import { EJobStatus } from 'common/enums'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { IContractDoc, NewCreatedContract, UpdateContractBody } from './contract.interfaces'
import Contract from './contract.model'

/**
 * create a contract
 * @param {NewCreatedContract} contractBody
 * @returns {Promise<IContractDoc>}
 */
export const createContract = async (contractBody: NewCreatedContract): Promise<IContractDoc> => {
  const job = await getJobById(contractBody?.job)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }

  const client = await getClientById(contractBody?.client)
  const freelancer = await getFreelancerById(contractBody?.freelancer)
  if (!client || !freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client or Freelancer not found')
  }

  if (client?.user === freelancer?.user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Done self-make silly contract')
  }

  // TODO: payment feature
  // if (client.balance < payment_amount) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Lack of balance')
  // }

  if (!(job.currentStatus === EJobStatus.OPEN || job.currentStatus === EJobStatus.PENDING)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job is not open or pending')
  }
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
 * Change status contract by id
 * @param {mongoose.Types.ObjectId} contractId
 * @param {string} status
 * @returns {Promise<IContractDoc | null>}
 */
export const changeStatusContractById = async (
  contractId: mongoose.Types.ObjectId,
  status: string,
  comment: string
): Promise<IContractDoc | null> => {
  const contract = await Contract.findByIdAndUpdate(contractId, {
    status: {
      status,
      date: new Date(),
      comment: comment || '',
    },
  })
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found')
  }
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
