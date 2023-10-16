/* eslint-disable @typescript-eslint/naming-convention */
import config from '@config/config'
import { getUserById } from '@modules/user/user.service'
import { ApiError } from 'common/errors'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { emailService } from '../../providers/email'
import catchAsync from '../../utils/catchAsync'
import { tokenService } from '../token'
import { userService } from '../user'
import * as authService from './auth.service'

const cookiConfigs = config.jwt.cookieOptions

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body)
  const tokens = await tokenService.generateAuthTokens(user)
  await userService.setUserRefreshToken(user._id, tokens.refresh.token)
  res.cookie('Authentication', tokens.access, {
    domain: '.localhost',
    httpOnly: cookiConfigs.httpOnly,
    secure: cookiConfigs.secure,
    maxAge: cookiConfigs.maxAge,
  })
  res.status(httpStatus.CREATED).send({ user, tokens: tokens.access })
})

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await authService.loginUserWithUsernameAndPassword(username, password)
  const tokens = await tokenService.generateAuthTokens(user)
  await userService.setUserRefreshToken(user._id, tokens.refresh.token)
  res.cookie('Authentication', tokens.access, {
    domain: '.localhost',
    httpOnly: cookiConfigs.httpOnly,
    secure: cookiConfigs.secure,
    maxAge: cookiConfigs.maxAge,
  })
  res.send({ user, tokens: tokens.access })
})

export const oAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user
  const user = await userService.getUserByEmail(email)
  const tokens = await tokenService.generateAuthTokens(user)
  await userService.setUserRefreshToken(user._id, tokens.refresh.token)
  res.cookie('Authentication', tokens.access, {
    domain: '.localhost',
    httpOnly: cookiConfigs.httpOnly,
    secure: cookiConfigs.secure,
    maxAge: cookiConfigs.maxAge,
  })
  res.send({ user, tokens: tokens.access })
})

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.user?._id)
  await userService.removeRefreshToken(req?.user?._id)
  res.cookie('Authentication', '', {
    domain: '.localhost',
    httpOnly: cookiConfigs.httpOnly,
    secure: cookiConfigs.secure,
    maxAge: cookiConfigs.maxAge,
  })
  res.status(httpStatus.NO_CONTENT).send()
})

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken)
  res.cookie('Authentication', userWithTokens.tokens.access, {
    domain: '.localhost',
    httpOnly: cookiConfigs.httpOnly,
    secure: cookiConfigs.secure,
    maxAge: cookiConfigs.maxAge,
  })
  res.send({ ...userWithTokens })
})

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email)
  const to = {
    email: req.user.email,
  }
  await emailService.sendResetPasswordEmail(to, resetPasswordToken)
  res.status(httpStatus.NO_CONTENT).send()
})

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query?.token, req.body.password)
  res.status(httpStatus.NO_CONTENT).send()
})

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user)
  const to = {
    email: req.user.email,
  }
  await emailService.sendVerificationEmail(to, verifyEmailToken, req.user.name)
  res.status(httpStatus.NO_CONTENT).send()
})

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query?.token)
  res.status(httpStatus.NO_CONTENT).send()
})

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await getUserById(req?.user?._id)
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not logged in')
  }
  res.send(user)
})
