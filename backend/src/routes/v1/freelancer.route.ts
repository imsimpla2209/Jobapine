import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { freelancerController, freelancerValidation } from '../../modules/freelancer'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(freelancerValidation.createFreelancer), freelancerController.registerFreelancer)
  .get(validate(freelancerValidation.getFreelancers), freelancerController.getFreelancers)
router
  .route('/filter')
  .post(validate(freelancerValidation.getAdvancedFreelancers), freelancerController.getAdvancedFreelancers)
router.route('/rcmd').post(validate(freelancerValidation.getRcmdFreelancers), freelancerController.getRcmdFreelancers)
router.route('/search').post(validate(freelancerValidation.searchFreelancers), freelancerController.searchFreelancers)

router
  .route('/:id')
  .get(auth(), validate(freelancerValidation.getFreelancer), freelancerController.getFreelancer)
  .patch(auth(), validate(freelancerValidation.updateFreelancer), freelancerController.updateFreelancer)
  .delete(auth(), validate(freelancerValidation.deleteFreelancer), freelancerController.deleteFreelancer)
router
  .route('/review/:id')
  .patch(auth(), validate(freelancerValidation.reviewFreelancer), freelancerController.reviewFreelancer)
router
  .route('/admin/:id')
  .delete(
    auth('manageUsers'),
    validate(freelancerValidation.deleteFreelancer),
    freelancerController.forceDeleteFreelancer
  )

export default router
