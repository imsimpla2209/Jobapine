import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { freelancerController, freelancerValidation } from '../../modules/freelancer'

const router: Router = express.Router()

router
  .route('/')
  .get(validate(freelancerValidation.getFreelancers), freelancerController.getFreelancers)
  .post(auth(), validate(freelancerValidation.createFreelancer), freelancerController.registerFreelancer)
router
  .route('/filter')
  .post(auth(), validate(freelancerValidation.getAdvancedFreelancers), freelancerController.getAdvancedFreelancers)
router.route('/rcmd').post(validate(freelancerValidation.getRcmdFreelancers), freelancerController.getRcmdFreelancers)
router.route('/search').post(validate(freelancerValidation.searchFreelancers), freelancerController.searchFreelancers)

router
  .route('/:id')
  .get(validate(freelancerValidation.getFreelancer), freelancerController.getFreelancer)
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
