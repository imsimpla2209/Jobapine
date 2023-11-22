/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import express from 'express'
import { auth } from '@modules/auth'
import { senVerification, sendVerificationEmailFunc } from '../utils/mailer'
import { getPresignedUrl, getCLPresignedUrl } from '../controllers/upload.controller'
import { sendSMS, sendTrigger } from '../controllers/sms.controller'

export const testRouter = express.Router()

testRouter.get('/testMail', async (req, res) => {
  const mailrs = await sendVerificationEmailFunc('iacokhactqt@gmail.com', '420ent', '22')
  res.status(200).end(JSON.stringify(mailrs))
})
testRouter.get('/testSms', async (req, res) => {
  const mailrs = await sendSMS(['0559372202'], '420ent', 5)
  res.status(200).send(mailrs)
})
testRouter.get('/testCL', auth(), getCLPresignedUrl)
