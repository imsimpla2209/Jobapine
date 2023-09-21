import httpStatus from 'http-status'
import mongoose from 'mongoose'
import Message from './skill.model'
import ApiError from '../../common/errors/ApiError'
import { IOptions, QueryResult } from '../../providers/paginate/paginate'
import { UpdateMessageBody, IMessageDoc, NewCreatedMessage } from './skill.interfaces'

/**
 * Register a message
 * @param {NewCreatedMessage} messageBody
 * @returns {Promise<IMessageDoc>}
 */
export const createMessage = async (messageBody: NewCreatedMessage): Promise<IMessageDoc> => {
  // if (await Message.isUserSigned(messageBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This user already is a Message')
  // }
  return Message.create(messageBody)
}

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryMessages = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const messages = await Message.paginate(filter, options)
  return messages
}

/**
 * Get message by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IMessageDoc | null>}
 */
export const getMessageById = async (id: mongoose.Types.ObjectId): Promise<IMessageDoc | null> =>
  Message.findById(id)

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
