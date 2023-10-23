import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as jobService from './job.service'
import categoryService from './sub_services/jobCategory.service'

export const createJob = catchAsync(async (req: Request, res: Response) => {
  const job = await jobService.createJob(req.body)
  res.status(httpStatus.CREATED).send(job)
})

export const getJobs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'skills', 'categories'])
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
    'proposals',
    'categories',
    'tags',
    'currentStatus',
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
  const result = await jobService.getRcmdJob(
    new mongoose.Types.ObjectId(req.query.freelancerId as string),
    req.query.categories,
    req.query.skills,
    options
  )
  res.send(result)
})

export const getSimilarJobs = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await jobService.getSimilarJobs(new mongoose.Types.ObjectId(req.query.id as string), options)
  res.send(result)
})

export const getJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const job = await jobService.getJobById(new mongoose.Types.ObjectId(req.params.id))
    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found')
    }
    res.send(job)
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No job id was sent')
  }
})

export const updateJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const job = await jobService.updateJobById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(job)
  }
})

export const updateJobStatus = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const job = await jobService.changeStatusJobById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body?.status,
      req.body?.comment
    )
    res.send(job)
  }
})

export const forcedDeleteJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await jobService.deleteJobById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteJob = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await jobService.softDeleteJobById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

// export const updateMulJobs = catchAsync(async (req: Request, res: Response) => {
//   if (typeof req.params?.id === 'string') {
//     await jobService.softDeleteJobById(new mongoose.Types.ObjectId(req.params.id))
//     res.status(httpStatus.NO_CONTENT).send()
//   }
// })

export const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await jobService.getAllJob()
  res.send(result)
})

// ================================Categories Controller================================= //

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAll()
  res.send(result)
})
