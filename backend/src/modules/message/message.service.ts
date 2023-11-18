/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { io } from '@core/libs/SocketIO'
import { createInvitation, createNotify, updateInvitationStatusById } from '@modules/notify/notify.service'
import { getProposalById, updateProposalStatusById } from '@modules/proposal/proposal.service'
import { getUserById } from '@modules/user/user.service'
import { EInvitationType, ESocketEvent, EStatus } from 'common/enums'
import { FEMessage, FERoutes } from 'common/enums/constant'
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
  filter['member'] &&
    (filter['member'] = { member: { $in: filter['member'].map(m => new mongoose.Types.ObjectId(m)) } })

  const filterExtract = Object.keys(filter).map(f => filter[f])
  const queryFilter = {
    $and: [...filterExtract, { isDeleted: { $ne: true } }],
  }

  options.populate = 'member,proposal'

  if (!options.projectBy) {
    options.projectBy =
      'proposal, member, seen, isDeleted, proposalStatusCatalog, image, background, createdAt, updatedAt, attachments'
  }

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc'
  }

  if (!options.limit) {
    options.limit = 200
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
 * Update message room by id
 * @param {mongoose.Types.ObjectId} messageId
 * @param {NewCreatedMessageRoom} updateBody
 * @returns {Promise<IMessageRoomDoc | null>}
 */
export const updateMessageRoomById = async (
  messageId: mongoose.Types.ObjectId,
  updateBody: NewCreatedMessageRoom
): Promise<IMessageRoomDoc | null> => {
  const message = await getMessageRoomById(messageId)
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found')
  }
  Object.assign(message, updateBody)
  await message.save()
  return message
}

export const createRequestMessage = async (from: any, to: any, proposalId?: any, text?: any) => {
  try {
    const fromUser = await getUserById(new mongoose.Types.ObjectId(from))
    const toUser = await getUserById(new mongoose.Types.ObjectId(to))
    let proposal
    if (!fromUser || !toUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'From or To user not found')
    }
    if (proposalId) {
      proposal = await getProposalById(new mongoose.Types.ObjectId(proposalId))
      if (!proposal) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found')
      }
    }
    const request = await createInvitation({
      to: toUser?._id,
      type: EInvitationType.MESSAGE,
      content: {
        content: FEMessage(fromUser?.name ?? fromUser.username).requestMessage,
        letter: text,
        jobId: proposal?.job,
        from: fromUser?._id,
        proposal: proposalId,
      },
    })
    createNotify({
      to: toUser,
      path: `${FERoutes.allInvitation}`,
      content: FEMessage(fromUser?.name ?? fromUser.username).requestMessage,
    })
    return request
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot create request')
  }
}

export const acceptMessageRequest = async (invitationId?: any) => {
  try {
    const invitation = await updateInvitationStatusById(
      new mongoose.Types.ObjectId(invitationId),
      EStatus.ACCEPTED,
      'Accepted'
    )
    const messageRoom = await createMessageRoom({
      member: [invitation?.content?.from, invitation?.content?.to],
      proposal: invitation?.content?.proposal,
    })
    if (invitation?.content?.proposal) {
      updateProposalStatusById(invitation?.content?.proposal, EStatus.INPROGRESS, 'Message Request is Accepted')
    }
    createNotify({
      to: invitation?.content?.from,
      path: `${FERoutes.allMessages}?proposalId=${invitation?.content?.proposal}`,
      content: FEMessage().acceptRequest,
    })
    return messageRoom
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot create request')
  }
}

export const checkMessage = async (member: any[], proposalId?: any) => {
  if (member?.length < 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot check msg')
  }

  const msgRoom = await getMessageRoomByOptions({
    $and: [
      { member: { $all: member.map(m => new mongoose.Types.ObjectId(m)) } },
      { proposal: new mongoose.Types.ObjectId(proposalId) },
    ],
  })
  if (!msgRoom) {
    const fromUser = await getUserById(new mongoose.Types.ObjectId(member[0]))
    const toUser = await getUserById(new mongoose.Types.ObjectId(member[1]))
    if (!fromUser || !toUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'From or To user not found')
    }
    const invi = await createRequestMessage(
      new mongoose.Types.ObjectId(member[0]),
      new mongoose.Types.ObjectId(member[1]),
      new mongoose.Types.ObjectId(proposalId),
      'Request create message'
    )
    return { item: invi, exist: false }
  }

  return { item: msgRoom, exist: true }
}

/**
 * Delete message by id
 * @param {mongoose.Types.ObjectId} messageId
 * @returns {Promise<IMessageRoomDoc | null>}
 */
export const deleteMessageRoomById = async (messageId: mongoose.Types.ObjectId): Promise<IMessageRoomDoc | null> => {
  const message = await updateMessageRoomById(messageId, { isDeleted: true })
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
  updateMessageRoomById(messageBody.room, {
    seen: false,
  })
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
  if (!options.projectBy) {
    options.projectBy = 'from, to, room, isDeleted, content, attachments, createdAt, updatedAt, seen'
  }

  const messages = await Message.paginate(queryFilter, options)
  return messages
}

/**
 * Change status job by id
 * @param {mongoose.Types.ObjectId} messageRoomId
 * @param {string} status
 * @returns {Promise<IMessageRoomDoc | null>}
 */
export const changeStatusMessageRoomById = async (
  messageRoomId: mongoose.Types.ObjectId,
  status: string,
  comment: string
): Promise<IMessageRoomDoc | null> => {
  const messageRoom = await MessageRoom.findByIdAndUpdate(messageRoomId, {
    status: {
      status,
      date: new Date(),
      comment: comment || '',
    },
  })
  if (!messageRoom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MessageRoom not found')
  }
  return messageRoom
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
  const message = updateMessageById(messageId, { isDeleted: true })
  return message
}
