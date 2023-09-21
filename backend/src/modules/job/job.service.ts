import httpStatus from 'http-status'
import mongoose from 'mongoose'
import Job from './job.model'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { UpdateJobBody, IJobDoc, NewCreatedJob } from './job.interfaces'

/**
 * Register a job
 * @param {NewCreatedJob} jobBody
 * @returns {Promise<IJobDoc>}
 */
export const createJob = async (jobBody: NewCreatedJob): Promise<IJobDoc> => {
  // if (await Job.isUserSigned(jobBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Job')
  // }
  return Job.create(jobBody)
}

/**
 * Query for jobs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryJobs = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const jobs = await Job.paginate(filter, options)
  return jobs
}

/**
 * Get job by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobById = async (id: mongoose.Types.ObjectId): Promise<IJobDoc | null> => Job.findById(id)

/**
 * Get job by jobname
 * @param {string} jobname
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobByJobname = async (jobname: string): Promise<IJobDoc | null> => Job.findOne({ jobname })

/**
 * Get job by email
 * @param {string} email
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobByEmail = async (email: string): Promise<IJobDoc | null> => Job.findOne({ email })

/**
 * Get job by option
 * @param {object} options
 * @returns {Promise<IJobDoc | null>}
 */
export const getJobByOptions = async (Options: any): Promise<IJobDoc | null> => Job.findOne(Options)

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
 * Delete job by id
 * @param {mongoose.Types.ObjectId} jobId
 * @returns {Promise<IJobDoc | null>}
 */
export const deleteJobById = async (jobId: mongoose.Types.ObjectId): Promise<IJobDoc | null> => {
  const job = await getJobById(jobId)
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
  }
  await job.deleteOne()
  return job
}
