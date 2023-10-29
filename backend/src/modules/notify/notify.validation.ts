import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedNotify } from './notify.interfaces'

const createNotifyBody: Record<keyof NewCreatedNotify, any> = {
  to: Joi.string(),
  path: Joi.string(),
  content: Joi.string(),
  image: Joi.string(),
  seen: Joi.boolean(),
}

export const createNotifyRoom = {
  body: Joi.object().keys({
    member: Joi.array().items(Joi.string()),
    proposalStatusCatalog: Joi.array().items(Joi.string()),
    proposal: Joi.string(),
    background: Joi.string(),
    image: Joi.string(),
    attachments: Joi.array().items(Joi.string()),
  }),
}

export const createNotify = {
  body: Joi.object().keys(createNotifyBody),
}

export const getNotifyRooms = {
  query: Joi.object().keys({
    to: Joi.string(),
    seen: Joi.boolean(),
    content: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getNotifys = {
  query: Joi.object().keys({
    to: Joi.string(),
    seen: Joi.boolean(),
    content: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getNotify = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateNotify = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      path: Joi.string(),
      content: Joi.string(),
      image: Joi.string(),
      seen: Joi.boolean(),
    })
    .min(1),
}

export const updateManyNotify = {
  query: Joi.object().keys({
    to: Joi.string().required(),
    seen: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      path: Joi.string(),
      content: Joi.string(),
      image: Joi.string(),
      seen: Joi.boolean(),
    })
    .min(1),
}

export const deleteNotify = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
