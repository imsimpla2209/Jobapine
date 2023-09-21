import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedSkill } from './skill.interfaces'

const createSkillBody: Record<keyof NewCreatedSkill, any> = {
  name: Joi.string().required(),
}

export const createSkill = {
  body: Joi.object().keys(createSkillBody),
}

export const getSkills = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getSkill = {
  params: Joi.object().keys({
    _id: Joi.string().custom(objectId),
  }),
}

export const updateSkill = {
  params: Joi.object().keys({
    _id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
    })
    .min(1),
}

export const deleteSkill = {
  params: Joi.object().keys({
    _id: Joi.string().custom(objectId),
  }),
}
