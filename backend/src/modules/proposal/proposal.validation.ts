import Joi from 'joi'
import { objectId, password } from '../../providers/validate/custom.validation'
import { NewCreatedProposal } from './proposal.interfaces'

const createProposalBody: Record<keyof NewCreatedProposal, any> = {
  job: Joi.string().required(),
  freelancer: Joi.string().required(),
  expectedAmount: Joi.number().positive,
  description: Joi.string().max(969),
  attachments: Joi.array().items(Joi.string()),
}

export const createProposal = {
  body: Joi.object().keys(createProposalBody),
}

export const getProposals = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getProposal = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateProposal = {
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

export const deleteProposal = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
