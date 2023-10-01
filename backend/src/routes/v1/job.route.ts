import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { jobController, jobValidation } from '../../modules/job'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(jobValidation.createJob), jobController.createJob)
  .post(validate(jobValidation.advancedGetJobs), jobController.getAdvancedJobs)
  .get(validate(jobValidation.getJobs), jobController.getJobs)
  .get(validate(jobValidation.searchJob), jobController.searchJobs)
  .get(validate(jobValidation.getRcmdJob), jobController.getRcmdJobs)

router
  .route('/:userId')
  .get(auth(), validate(jobValidation.getJob), jobController.getJob)
  .patch(auth(), validate(jobValidation.updateJob), jobController.updateJob)
  .delete(auth(), validate(jobValidation.deleteJob), jobController.deleteJob)
  .delete(auth('manageUsers'), validate(jobValidation.deleteJob), jobController.forcedDeleteJob)

export default router
