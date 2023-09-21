import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import ApiError from '../../common/errors/ApiError'
import pick from '../../utils/pick'
import { IOptions } from '../../providers/paginate/paginate'
import * as paymentService from './payment.service'

export const createPayment = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.createPayment(req.body)
  res.status(httpStatus.CREATED).send(payment)
})

export const getPayments = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await paymentService.queryPayments(filter, options)
  res.send(result)
})

export const getPayment = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.paymentId === 'string') {
    const payment = await paymentService.getPaymentById(new mongoose.Types.ObjectId(req.params.paymentId))
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found')
    }
    res.send(payment)
  }
})

export const updatePayment = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.paymentId === 'string') {
    const payment = await paymentService.updatePaymentById(new mongoose.Types.ObjectId(req.params.paymentId), req.body)
    res.send(payment)
  }
})

export const deletePayment = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params?.paymentId === 'string') {
    await paymentService.deletePaymentById(new mongoose.Types.ObjectId(req.params.paymentId))
    res.status(httpStatus.NO_CONTENT).send()
  }
})
