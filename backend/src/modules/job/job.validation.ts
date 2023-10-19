/* eslint-disable no-useless-computed-key */
import { EComplexity, EJobStatus, EPaymenType } from 'common/enums'
import Joi from 'joi'
import { objectId } from '../../providers/validate/custom.validation'
import { NewCreatedJob } from './job.interfaces'

const jobPaymentBody = Joi.object({
  amount: Joi.number().positive(),
  type: Joi.string().valid(...Object.values(EPaymenType)),
})

const jobscopeBody = Joi.object({
  complexity: Joi.number().valid(...Object.values(EComplexity)),
  duration: Joi.number().positive(),
})

const jobPreferencesBody = Joi.object({
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
  tags: Joi.array().items(Joi.string()),
  type: Joi.string(),
  experienceLevel: Joi.array().items(Joi.string()),
  visibility: Joi.string(),
  jobDuration: Joi.string(),
}

export const createJob = {
  body: Joi.object().keys(createJobBody),
}

export const getJobs = {
  query: Joi.object().keys({
    title: Joi.string(),
    nOEmployee: Joi.number().positive(),
    complexity: Joi.string(),
    duration: Joi.number().positive(),
    description: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const advancedGetJobs = {
  body: Joi.object().keys({
    title: Joi.string(),
    ['preferences.nOEmployee']: Joi.object().keys({ from: Joi.number(), to: Joi.number() }),
    ['preferences.locations']: Joi.array().items(Joi.string()),
    ['scope.complexity']: Joi.array().items(Joi.number().valid(...Object.values(EComplexity))),
    ['scope.duration']: Joi.object().keys({ from: Joi.number(), to: Joi.number() }),
    ['payment.amount']: Joi.object().keys({ from: Joi.number(), to: Joi.number() }),
    proposals: Joi.object().keys({ from: Joi.number(), to: Joi.number() }),
    clientInfo: Joi.array().items(Joi.string()),
    clientHistory: Joi.string(),
    ['payment.type']: Joi.array().items(Joi.string().valid(...Object.values(EPaymenType))),
    description: Joi.string(),
    budget: Joi.object().keys({ from: Joi.number(), to: Joi.number() }),
    categories: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
    currentStatus: Joi.array().items(Joi.string()),
  }),
  query: Joi.object().keys({
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
      tags: Joi.array().items(Joi.string()),
    })
    .min(1),
}

export const deleteJob = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
}

export const updateJobStatus = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string()
        .valid(...Object.values(EJobStatus))
        .required(),
      comment: Joi.string(),
    })
    .min(1),
}

export const getRcmdJob = {
  params: Joi.object().keys({
    freelancerId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const searchJob = {
  body: Joi.object().keys({
    searchText: Joi.string().required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}
