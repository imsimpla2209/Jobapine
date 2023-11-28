import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { clientController, clientValidation } from '../../modules/client'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(clientValidation.createClient), clientController.registerClient)
  .get(validate(clientValidation.getClients), clientController.getClients)

router
  .route('/:id')
  .get(auth(), validate(clientValidation.getClient), clientController.getClient)
  .patch(auth(), validate(clientValidation.updateClient), clientController.updateClient)
  .delete(auth(), validate(clientValidation.deleteClient), clientController.deleteClient)
router.route('/review/:id').patch(auth(), validate(clientValidation.reviewClient), clientController.reviewClient)
router.route('/admin/:id').delete(auth(), validate(clientValidation.deleteClient), clientController.forcedDeleteClient)

export default router
