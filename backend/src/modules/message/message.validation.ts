import Joi from 'joi'
import { objectId, password } from '../../providers/validate/custom.validation'
import { NewCreatedMessage } from './message.interfaces'

const createMessageBody: Record<keyof NewCreatedMessage, any> = {
  room: Joi.string().required(),
  from: Joi.string().required(),
  to: Joi.string().required,
  content: Joi.string().max(969).required(),
  proposalStatusCatalog: Joi.array().items(Joi.string()),
  proposal: Joi.string(),
  attachments: Joi.array().items(Joi.string()),
}

export const createMessage = {
  body: Joi.object().keys(createMessageBody),
}

export const getMessages = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getMessage = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateMessage = {
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

export const deleteMessage = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
