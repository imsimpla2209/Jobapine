import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedJob } from './job.interfaces'

const jobPaymentBody = Joi.object({
  locations: Joi.array().items(Joi.string()),
  hireDate: Joi.number().positive(),
})

const jobscopeBody = Joi.object({
  complexity: Joi.string(),
  duration: Joi.number().positive(),
})

const jobPreferencesBody = Joi.object({
  hireDate: Joi.number().positive(),
  nOEmployee: Joi.number().positive(),
  locations: Joi.array().items(Joi.string()),
})

const createJobBody: Record<keyof NewCreatedJob, any> = {
  client: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().max(969),
  reqSkills: Joi.array().items(Joi.string()),
  checkLists: Joi.array().items(Joi.string()),
  attachments: Joi.array().items(Joi.string()),
  categories: Joi.array().items(Joi.string()),
  payment: jobPaymentBody,
  scope: jobscopeBody,
  questions: Joi.array().items(Joi.string()),
  preferences: jobPreferencesBody,
  budget: Joi.number().positive(),
}

export const createJob = {
  body: Joi.object().keys(createJobBody),
}

export const getJobs = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getJob = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateJob = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      description: Joi.string().max(969),
      reqSkills: Joi.array().items(Joi.string()),
      checkLists: Joi.array().items(Joi.string()),
      attachments: Joi.array().items(Joi.string()),
      categories: Joi.array().items(Joi.string()),
      payment: jobPaymentBody,
      scope: jobscopeBody,
      questions: Joi.array().items(Joi.string()),
      preferences: jobPreferencesBody,
      budget: Joi.number().positive(),
    })
    .min(1),
}

export const deleteJob = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}
