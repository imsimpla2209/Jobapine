import Joi from 'joi'
import { objectId, password } from '../../providers/validate/custom.validation'
import { NewCreatedContract } from './contract.interfaces'

const createContractBody: Record<keyof NewCreatedContract, any> = {
  proposal: Joi.string().required(),
  freelancer: Joi.string().required(),
  client: Joi.string().required(),
  overview: Joi.string().max(969),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  paymentType: Joi.string(),
  agreeAmount: Joi.string(),
  catalogs: Joi.array().items(Joi.string()),
  attachments: Joi.array().items(Joi.string()),
}

export const createContract = {
  body: Joi.object().keys(createContractBody),
}

export const getContracts = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getContract = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateContract = {
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

export const deleteContract = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
