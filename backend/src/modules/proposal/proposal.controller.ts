import { getFreelancerById } from '@modules/freelancer/freelancer.service'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions } from '../../providers/paginate/paginate'
import catchAsync from '../../utils/catchAsync'
import pick from '../../utils/pick'
import * as proposalService from './proposal.service'

export const createProposal = catchAsync(async (req: Request, res: Response) => {
  const proposal = await proposalService.createProposal(req.user._id, req.body)
  res.status(httpStatus.CREATED).send(proposal)
})

export const getProposals = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['job', '_id', 'status.status', 'freelancer', 'currentStatus'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await proposalService.queryProposals(filter, options)
  res.send(result)
})

export const getProposal = catchAsync(async (req: Request, res: Response) => {
  const proposal = await proposalService.getProposalById(new mongoose.Types.ObjectId(req.params.id))
  if (!proposal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
  }
  res.send(proposal)
})

export const updateProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const proposal = await proposalService.updateProposalById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(proposal)
  }
})

export const updateProposalStatus = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const proposal = await proposalService.updateProposalStatusById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body?.status,
      req.body?.comment
    )
    res.send(proposal)
  }
})

export const withdrawProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const freelancer = await getFreelancerById(req?.user?._id)
    if (!freelancer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Freelancer not found')
    }
    await proposalService.withdrawProposalById(new mongoose.Types.ObjectId(req.params.id), freelancer._id)
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const deleteProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await proposalService.deleteProposalById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
