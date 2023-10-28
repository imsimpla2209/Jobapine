/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { io } from '@core/libs/SocketIO'
import { ESocketEvent } from 'common/enums'
import logger from 'common/logger/logger'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import {
  IMessageDoc,
  IMessageRoomDoc,
  NewCreatedMessage,
  NewCreatedMessageRoom,
  UpdateMessageBody,
} from './message.interfaces'
import Message, { MessageRoom } from './message.model'

/**
 * Register a message
 * @param {NewCreatedMessage} messageBody
 * @returns {Promise<IMessageRoomDoc>}
 */
export const createMessageRoom = async (messageBody: NewCreatedMessageRoom): Promise<IMessageRoomDoc> => {
  // if (await Message.isUserSigned(messageBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Message')
  // }
  return MessageRoom.create(messageBody)
}

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryMessageRooms = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['proposal'] && (filter['proposal'] = { proposal: `${filter['proposal']}` })
  filter['members'] && (filter['members'] = { members: { $in: filter['members'] } })

  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [...filterExtract, { isDeleted: { $ne: true } }],
  }

  options.populate = 'proposal,members'
  // if (!options.projectBy) {
  //   options.projectBy =
  //     'client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
  // }

  if (!options.limit) {
    options.limit = 1000
  }

  const messages = await MessageRoom.paginate(queryFilter, options)
  return messages
}

/**
 * Get message by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IMessageRoomDoc | null>}
 */
export const getMessageRoomById = async (id: mongoose.Types.ObjectId): Promise<IMessageRoomDoc | null> =>
  MessageRoom.findById(id)

/**
 * Get message by option
 * @param {object} options
 * @returns {Promise<IMessageRoomDoc | null>}
 */
export const getMessageRoomByOptions = async (Options: any): Promise<IMessageRoomDoc | null> =>
  MessageRoom.findOne(Options)

/**
 * Update message by id
 * @param {mongoose.Types.ObjectId} messageId
 * @param {UpdateMessageBody} updateBody
 * @returns {Promise<IMessageRoomDoc | null>}
 */
export const updateMessageRoomById = async (
  messageId: mongoose.Types.ObjectId,
  updateBody: UpdateMessageBody
): Promise<IMessageRoomDoc | null> => {
  const message = await getMessageRoomById(messageId)
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found')
  }
  Object.assign(message, updateBody)
  await message.save()
  return message
}

/**
 * Delete message by id
 * @param {mongoose.Types.ObjectId} messageId
 * @returns {Promise<IMessageRoomDoc | null>}
 */
export const deleteMessageRoomById = async (messageId: mongoose.Types.ObjectId): Promise<IMessageRoomDoc | null> => {
  const message = await getMessageRoomById(messageId)
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found')
  }
  await message.deleteOne()
  return message
}

/**
 * Register a message
 * @param {NewCreatedMessage} messageBody
 * @returns {Promise<IMessageDoc>}
 */
export const createMessage = async (messageBody: NewCreatedMessage): Promise<IMessageDoc> => {
  // if (await Message.isUserSigned(messageBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Message')
  // }
  if (io.onlineUsers[messageBody?.to]) {
    logger.info(`user: ${messageBody?.from}  Send message to user: ${messageBody?.to}`)
    io.onlineUsers[messageBody?.to].socket.emit(ESocketEvent.SENDMSG, messageBody)
  }
  return Message.create(messageBody)
}

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryMessages = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  filter['from'] && (filter['from'] = { from: `${filter['from']}` })
  filter['room'] && (filter['room'] = { room: `${filter['room']}` })

  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [...filterExtract, { isDeleted: { $ne: true } }],
  }

  // options.populate = 'proposal,members'
  // if (!options.projectBy) {
  //   options.projectBy =
  //     'client, categories, title, description, locations, complexity, payment, budget, createdAt, nOProposals, nOEmployee, preferences'
  // }

  const messages = await Message.paginate(queryFilter, options)
  return messages
}

/**
 * Get message by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IMessageDoc | null>}
 */
export const getMessageById = async (id: mongoose.Types.ObjectId): Promise<IMessageDoc | null> => Message.findById(id)

/**
 * Get message by messagename
 * @param {string} messagename
 * @returns {Promise<IMessageDoc | null>}
 */
export const getMessageByMessagename = async (messagename: string): Promise<IMessageDoc | null> =>
  Message.findOne({ messagename })

/**
 * Get message by email
 * @param {string} email
 * @returns {Promise<IMessageDoc | null>}
 */
export const getMessageByEmail = async (email: string): Promise<IMessageDoc | null> => Message.findOne({ email })

/**
 * Get message by option
 * @param {object} options
 * @returns {Promise<IMessageDoc | null>}
 */
export const getMessageByOptions = async (Options: any): Promise<IMessageDoc | null> => Message.findOne(Options)

/**
 * Update message by id
 * @param {mongoose.Types.ObjectId} messageId
 * @param {UpdateMessageBody} updateBody
 * @returns {Promise<IMessageDoc | null>}
 */
export const updateMessageById = async (
  messageId: mongoose.Types.ObjectId,
  updateBody: UpdateMessageBody
): Promise<IMessageDoc | null> => {
  const message = await getMessageById(messageId)
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found')
  }
  Object.assign(message, updateBody)
  await message.save()
  return message
}

/**
 * Delete message by id
 * @param {mongoose.Types.ObjectId} messageId
 * @returns {Promise<IMessageDoc | null>}
 */
export const deleteMessageById = async (messageId: mongoose.Types.ObjectId): Promise<IMessageDoc | null> => {
  const message = await getMessageById(messageId)
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found')
  }
  await message.deleteOne()
  return message
}
