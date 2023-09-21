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
  const freelancer = await freelancerService.registerFreelancer(req.body)
  updateUserById(new mongoose.Types.ObjectId(req.user?._id), {
    lastLoginAs: EUserType.CLIENT,
  })
  res.status(httpStatus.CREATED).send(freelancer)
})

export const getFreelancers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'skills', 'rating', 'currentLocations', 'preferJobType', 'member'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await freelancerService.queryFreelancers(filter, options)
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

export const updateFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await freelancerService.updateFreelancerById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body
    )
    res.send(freelancer)
  }
})

export const deleteFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.deleteFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const reviewFreelancer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await freelancerService.deleteFreelancerById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
