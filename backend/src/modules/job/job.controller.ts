import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as jobService from './job.service'

export const createJob = catchAsync(async (req: Request, res: Response) => {
  const job = await jobService.createJob(req.body)
  res.status(httpStatus.CREATED).send(job)
})

export const getJobs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.queryJobs(filter, options)
  res.send(result)
})

export const getAdvancedJobs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.body, [
    'scope.duration',
    'scope.complexity',
    'preferences.locations',
    'preferences.nOEmployee',
    'title',
    'budget',
    'payment.type',
    'payment.amount',
    'description',
    'reqSkills',
    'nOProposals',
    'categories',
    'tags',
  ])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.queryAdvancedJobs(filter, options)
  res.send(result)
})

export const searchJobs = catchAsync(async (req: Request, res: Response) => {
  const { searchText } = req.body
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.searchJobsByText(searchText, options)
  res.send(result)
})

export const getRcmdJobs = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.getRcmdJob(new mongoose.Types.ObjectId(req.params.freelancerId), options)
  res.send(result)
})

export const getJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.jobId === 'string') {
    const job = await jobService.getJobById(new mongoose.Types.ObjectId(req.params.jobId))
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
    }
    res.send(job)
  }
})

export const updateJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.jobId === 'string') {
    const job = await jobService.updateJobById(new mongoose.Types.ObjectId(req.params.jobId), req.body)
    res.send(job)
  }
})

export const forcedDeleteJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.jobId === 'string') {
    await jobService.deleteJobById(new mongoose.Types.ObjectId(req.params.jobId))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.jobId === 'string') {
    await jobService.softDeleteJobById(new mongoose.Types.ObjectId(req.params.jobId))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
