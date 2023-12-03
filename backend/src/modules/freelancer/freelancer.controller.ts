/* eslint-disable @typescript-eslint/naming-convention */
import { updateUserById } from '@modules/user/user.service'
import { EUserType } from 'common/enums'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions } from '../../providers/paginate/paginate'
import catchAsync from '../../utils/catchAsync'
import pick from '../../utils/pick'
import * as freelancerService from './freelancer.service'

export const registerFreelancer = catchAsync(async (req: Request, res: Response) => {
  try {
    const { _id } = req.user
    const freelancer = await freelancerService.registerFreelancer(new mongoose.Types.ObjectId(_id), req.body)
    updateUserById(new mongoose.Types.ObjectId(req.user?._id), {
      lastLoginAs: EUserType.FREELANCER,
    })
    freelancerService.updateSimilarById(freelancer?._id)
    res.status(httpStatus.CREATED).send(freelancer)
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Something Went Wrong ${err}`)
  }
})

export const getFreelancers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'skills', 'currentLocations', 'preferJobType'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.queryFreelancers(filter, options)
  res.send(result)
})

export const getAdvancedFreelancers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.body, [
    'id',
    'name',
    'intro',
    'currentLocations',
    'preferJobType',
    'skills',
    'jobsDone.number',
    'jobsDone.success',
    'earned',
    'rating',
    'available',
  ])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.queryAdvancedFreelancers(filter, options)
  res.send(result)
})

export const searchFreelancers = catchAsync(async (req: Request, res: Response) => {
  const { searchText } = req.body
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.searchFreelancersByText(searchText, options)
  res.send(result)
})

export const getRcmdFreelancers = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.getRcmdFreelancers(new mongoose.Types.ObjectId(req.params.jobId), options)
  res.send(result)
})

export const getFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await freelancerService.getFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    res.send(freelancer)
  }
})

export const getFreelancerByOption = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions(req.body)
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
  }
  res.send(freelancer)
})

export const updateFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await freelancerService.updateFreelancerById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body
    )
    freelancerService.updateSimilarById(freelancer?._id)
    res.send(freelancer)
  }
})

export const updateSimilarById = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const newSimilarDoc = await freelancerService.updateSimilarById(freelancer?._id)
  res.send(newSimilarDoc)
})

export const createProfile = catchAsync(async (req: Request, res: Response) => {
  const freelancer = await freelancerService.getFreelancerByOptions({ user: req?.user?._id })
  if (!freelancer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not a freelancer yet')
  }
  const updatedFreelancer = await freelancerService.createFreelancerProfileById(
    new mongoose.Types.ObjectId(freelancer?._id),
    req.body
  )
  freelancerService.updateSimilarById(updatedFreelancer?._id)
  res.send(updatedFreelancer)
})

export const forceDeleteFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.deleteFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.softDeleteFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const reviewFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.reviewFreelancerById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.status(httpStatus.NO_CONTENT).send()
  }
})
