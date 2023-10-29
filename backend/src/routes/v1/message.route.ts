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
  .route('/rooms/')
  .post(validate(messageValidation.createMessageRoom), messageController.createMessageRoom)
  .get(validate(messageValidation.getMessageRooms), messageController.getMessageRooms)

router
  .route('/:id')
  .get(auth(), validate(messageValidation.getMessage), messageController.getMessage)
  .patch(auth(), validate(messageValidation.updateMessage), messageController.updateMessage)
  .delete(auth(), validate(messageValidation.deleteMessage), messageController.deleteMessage)

router
  .route('/rooms/:id')
  .get(auth(), validate(messageValidation.getMessageRooms), messageController.getMessageRooms)
  .patch(auth(), validate(messageValidation.updateMessageRoom), messageController.updateMessageRoom)
  .delete(auth(), validate(messageValidation.deleteMessage), messageController.deleteMessageRoom)

export default router
