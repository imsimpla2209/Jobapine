import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as userService from './client.service'

export const registerClient = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerClient(req.body)
  res.status(httpStatus.CREATED).send(user)
})

export const getClients = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await userService.queryClients(filter, options)
  res.send(result)
})

export const getClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const user = await userService.getClientById(new mongoose.Types.ObjectId(req.params.id))
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Client not found')
    }
    res.send(user)
  }
})

export const updateClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    const user = await userService.updateClientById(new mongoose.Types.ObjectId(req.params.id), req.body)
    res.send(user)
  }
})

export const deleteClient = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.id === 'string') {
    await userService.deleteClientById(new mongoose.Types.ObjectId(req.params.id))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
