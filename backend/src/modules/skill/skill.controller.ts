import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as messageService from './skill.service'

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const message = await messageService.createMessage(req.body)
  res.status(httpStatus.CREATED).send(message)
})

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await messageService.queryMessages(filter, options)
  res.send(result)
})

export const getMessage = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.messageId === 'string') {
    const message = await messageService.getMessageById(new mongoose.Types.ObjectId(req.params.messageId))
    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Message not found')
    }
    res.send(message)
  }
})

export const updateMessage = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.messageId === 'string') {
    const message = await messageService.updateMessageById(new mongoose.Types.ObjectId(req.params.messageId), req.body)
    res.send(message)
  }
})

export const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.messageId === 'string') {
    await messageService.deleteMessageById(new mongoose.Types.ObjectId(req.params.messageId))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
