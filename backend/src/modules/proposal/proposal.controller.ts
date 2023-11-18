import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as proposalService from './proposal.service'

export const createProposal = catchAsync(async (req: Request, res: Response) => {
  const proposal = await proposalService.createProposal(req.user._id, req.body)
  res.status(httpStatus.CREATED).send(proposal)
})

export const getProposals = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['job', '_id', 'status.status', 'freelancer'])
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

export const deleteProposal = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await proposalService.deleteProposalById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
