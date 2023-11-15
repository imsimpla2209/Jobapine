/* eslint-disable @typescript-eslint/dot-notation */
import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as contractService from './contract.service'

export const createContract = catchAsync(async (req: Request, res: Response) => {
  const contract = await contractService.createContract(req.body, req.body?.isAgree)
  res.status(httpStatus.CREATED).send(contract)
})

export const acceptContract = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const contract = await contractService.acceptContract(
      new mongoose.Types.ObjectId(req.params.id),
      new mongoose.Types.ObjectId(pick(req.query, ['invitationId'])['invitationId'])
    )
    res.status(httpStatus.CREATED).send(contract)
  }
})

export const rejectContract = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const contract = await contractService.rejectContract(
      new mongoose.Types.ObjectId(req.params.id),
      new mongoose.Types.ObjectId(pick(req.query, ['invitationId'])['invitationId'])
    )
    res.status(httpStatus.CREATED).send(contract)
  }
})

export const getContracts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['job', 'proposal', 'client', 'freelancer', 'currentStatus'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await contractService.queryContracts(filter, options)
  res.send(result)
})

export const getContract = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const contract = await contractService.getContractById(new mongoose.Types.ObjectId(req.params.id))
    if (!contract) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found')
    }
    res.send(contract)
  }
})

export const updateContract = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const contract = await contractService.updateContractById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(contract)
  }
})

export const updateContractStatus = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const contract = await contractService.changeStatusContractById(
      new mongoose.Types.ObjectId(req.params.id),
      req.body?.status,
      req.body?.comment
    )
    res.send(contract)
  }
})

export const deleteContract = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await contractService.deleteContractById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
