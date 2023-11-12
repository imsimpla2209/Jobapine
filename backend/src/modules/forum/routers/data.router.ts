/* eslint-disable import/prefer-default-export */
import express from 'express'
import { ideasExcel } from '../controllers/data.controller'

export const dataRouter = express.Router()

dataRouter.get('/ideasExcel', ideasExcel)
