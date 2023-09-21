import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewRegisteredFreelancer } from './freelancer.interfaces'

const skillBody = Joi.object({
  skill: Joi.string(),
  level: Joi.number().positive(),
})

const createFreelancerBody: Record<keyof NewRegisteredFreelancer, any> = {
  user: Joi.string().required(),
  name: Joi.string().required(),
  intro: Joi.string(),
  skills: Joi.array().items(skillBody),
  certificate: Joi.string(),
  images: Joi.array().items(Joi.string()),
  preferJobType: Joi.array().items(Joi.string()),
  currentLocations: Joi.array().items(Joi.string()),
  preferencesURL: Joi.array().items(Joi.string()),
}

export const createFreelancer = {
  body: Joi.object().keys(createFreelancerBody),
}

export const getFreelancers = {
  query: Joi.object().keys({
    name: Joi.string(),
    skills: Joi.array().items(skillBody),
    preferJobType: Joi.array().items(Joi.string()),
    currentLocations: Joi.array().items(Joi.string()),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getFreelancer = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateFreelancer = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      intro: Joi.string(),
      skills: Joi.array().items(skillBody),
      certificate: Joi.string(),
      images: Joi.array().items(Joi.string()),
      preferJobType: Joi.array().items(Joi.string()),
      currentLocations: Joi.array().items(Joi.string()),
      preferencesURL: Joi.array().items(Joi.string()),
    })
    .min(1),
}

export const reviewFreelancer = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      creator: Joi.string(),
      content: Joi.string(),
      rating: Joi.number().positive(),
      isAnonymous: Joi.boolean(),
    })
    .min(1),
}

export const deleteFreelancer = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
