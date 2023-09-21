import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { freelancerController, freelancerValidation } from '../../modules/freelancer'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(freelancerValidation.createFreelancer), freelancerController.registerFreelancer)
  .post(validate(freelancerValidation.getAdvancedFreelancers), freelancerController.getAdvancedFreelancers)
  .get(validate(freelancerValidation.getFreelancers), freelancerController.getFreelancers)
  .get(validate(freelancerValidation.searchFreelancers), freelancerController.searchFreelancers)
  .get(validate(freelancerValidation.getRcmdFreelancers), freelancerController.getRcmdFreelancers)

router
  .route('/:userId')
  .get(auth(), validate(freelancerValidation.getFreelancer), freelancerController.getFreelancer)
  .patch(auth(), validate(freelancerValidation.updateFreelancer), freelancerController.updateFreelancer)
  .patch(auth(), validate(freelancerValidation.reviewFreelancer), freelancerController.reviewFreelancer)
  .delete(auth(), validate(freelancerValidation.deleteFreelancer), freelancerController.deleteFreelancer)
  .delete(
    auth('manageUsers'),
    validate(freelancerValidation.deleteFreelancer),
    freelancerController.forceDeleteFreelancer
  )

export default router
