import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { messageController, messageValidation } from '../../modules/message'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(messageValidation.createMessage), messageController.createMessage)
  .get(validate(messageValidation.getMessages), messageController.getMessages)

router
  .route('/:userId')
  .get(auth(), validate(messageValidation.getMessage), messageController.getMessage)
  .patch(auth(), validate(messageValidation.updateMessage), messageController.updateMessage)
  .delete(auth(), validate(messageValidation.deleteMessage), messageController.deleteMessage)

export default router
