/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { io } from '@core/libs/SocketIO'
import { ESocketEvent } from 'common/enums'
import { logger } from 'common/logger'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { INotifyDoc, NewCreatedNotify, UpdateNotifyBody } from './notify.interfaces'
import Notify from './notify.model'

/**
 * Register a notify
 * @param {NewCreatedNotify} notifyBody
 * @returns {Promise<INotifyDoc>}
 */
export const createNotify = async (notifyBody: NewCreatedNotify): Promise<INotifyDoc> => {
  // if (await Notify.isUserSigned(notifyBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Notify')
  // }
  if (io.onlineUsers[notifyBody?.to]) {
    logger.info(`Send notify to user: ${notifyBody?.to}`)
    io.onlineUsers[notifyBody?.to].socket.emit(ESocketEvent.SENDNOTIFY, notifyBody)
    // .to(io.onlineUsers[notifyBody?.to]?.socketId)
  }
  return Notify.create(notifyBody)
}

/**
 * Query for notifys
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryNotifys = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['to'] && (filter['to'] = { to: `${filter['to']}` })
  filter['seen'] && (filter['seen'] = { seen: `${filter['seen']}` })

  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [...filterExtract, { isDeleted: { $ne: true } }],
  }

  // options.populate = 'proposal,members'
  if (!options.projectBy) {
    options.projectBy = 'to, path, seen, isDeleted, content, image, createdAt,'
  }

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc'
  }

  if (!options.limit) {
    options.limit = 200
  }

  const notifys = await Notify.paginate(queryFilter, options)
  return notifys
}

/**
 * Get notify by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyById = async (id: mongoose.Types.ObjectId): Promise<INotifyDoc | null> => Notify.findById(id)

/**
 * Get notify by notifyname
 * @param {string} notifyname
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyByNotifyname = async (notifyname: string): Promise<INotifyDoc | null> =>
  Notify.findOne({ notifyname })

/**
 * Get notify by email
 * @param {string} email
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyByEmail = async (email: string): Promise<INotifyDoc | null> => Notify.findOne({ email })

/**
 * Get notify by option
 * @param {object} options
 * @returns {Promise<INotifyDoc | null>}
 */
export const getNotifyByOptions = async (Options: any): Promise<INotifyDoc | null> => Notify.findOne(Options)

/**
 * Update notify by id
 * @param {mongoose.Types.ObjectId} notifyId
 * @param {UpdateNotifyBody} updateBody
 * @returns {Promise<INotifyDoc | null>}
 */
export const updateNotifyById = async (
  notifyId: mongoose.Types.ObjectId,
  updateBody: UpdateNotifyBody
): Promise<INotifyDoc | null> => {
  const notify = await getNotifyById(notifyId)
  if (!notify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notify not found')
  }
  Object.assign(notify, updateBody)
  await notify.save()
  return notify
}

/**
 * Update many notify by options
 * @param {any} options
 * @param {UpdateNotifyBody} updateBody
 * @returns {Promise<any | null>}
 */
export const updateManyNotifyByOptions = async (options: any, updateBody: UpdateNotifyBody): Promise<any | null> => {
  try {
    const notify = await Notify.updateMany(options, updateBody)
    return notify
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update these notifies')
  }
}

/**
 * Delete notify by id
 * @param {mongoose.Types.ObjectId} notifyId
 * @returns {Promise<INotifyDoc | null>}
 */
export const deleteNotifyById = async (notifyId: mongoose.Types.ObjectId): Promise<INotifyDoc | null> => {
  const notify = await getNotifyById(notifyId)
  if (!notify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notify not found')
  }
  await notify.deleteOne()
  return notify
}
