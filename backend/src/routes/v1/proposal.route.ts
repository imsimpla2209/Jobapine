import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { proposalController, proposalValidation } from '../../modules/proposal'

const router: Router = express.Router()

router
  .route('/')
  .get(auth(), validate(proposalValidation.getProposals), proposalController.getProposals)
  .post(auth(), validate(proposalValidation.createProposal), proposalController.createProposal)

router
  .route('/:id')
  .get(auth(), validate(proposalValidation.getProposal), proposalController.getProposal)
  .patch(auth(), validate(proposalValidation.updateProposal), proposalController.updateProposal)
  .patch(auth(), validate(proposalValidation.updateProposalStatus), proposalController.updateProposalStatus)
  .delete(auth(), validate(proposalValidation.deleteProposal), proposalController.deleteProposal)

export default router
