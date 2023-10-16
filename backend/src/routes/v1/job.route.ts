import { getSkills } from '@modules/skill/skill.controller'
import express, { Router } from 'express'
import { auth } from '../../modules/auth'
import { jobController, jobValidation } from '../../modules/job'
import { validate } from '../../providers/validate'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(jobValidation.createJob), jobController.createJob)
  .get(validate(jobValidation.getJobs), jobController.getJobs)

router.route('/filter').post(validate(jobValidation.advancedGetJobs), jobController.getAdvancedJobs)
router.route('/search').get(validate(jobValidation.searchJob), jobController.searchJobs)
router.route('/rcmd').get(validate(jobValidation.getRcmdJob), jobController.getRcmdJobs)
router.route('/categories').get(jobController.getCategories)
router.route('/skills').get(getSkills)

router
  .route('/:id')
  .get(validate(jobValidation.getJob), jobController.getJob)
  .patch(auth(), validate(jobValidation.updateJob), jobController.updateJob)
  .delete(auth(), validate(jobValidation.deleteJob), jobController.deleteJob)
router.route('/status/:id').patch(auth(), validate(jobValidation.updateJobStatus), jobController.updateJobStatus)
router.route('/admin/:id').delete(auth('manageUsers'), validate(jobValidation.deleteJob), jobController.forcedDeleteJob)

export default router
