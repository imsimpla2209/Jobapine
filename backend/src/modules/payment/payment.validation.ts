import Joi from 'joi'
import { objectId, password } from '../../providers/validate/custom.validation'
import { NewCreatedPayment } from './payment.interfaces'

const createPaymentBody: Record<keyof NewCreatedPayment, any> = {
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.number().required(),
  paymentMethod: Joi.string(),
}

export const createPayment = {
  body: Joi.object().keys(createPaymentBody),
}

export const getPayments = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getPayment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updatePayment = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
}

export const deletePayment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
