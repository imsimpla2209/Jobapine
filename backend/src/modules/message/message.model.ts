import { EJobStatus } from 'common/enums'
import mongoose from 'mongoose'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { IMessageDoc, IMessageEmployee, IMessageEmployeeModel, IMessageModel } from './message.interfaces'

const messageSchema = new mongoose.Schema<IMessageDoc, IMessageModel>(
  {
    client: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
    freelancer: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
    content: {
      type: String,
      required: true,
    },
    proposalStatusCatalog: [{ type: String, required: 'false', default: [] }],
    attachments: [{ type: String, required: 'false', default: [] }],
    proposal: { type: mongoose.Types.ObjectId, ref: 'Proposal' },
  },
  {
    timestamps: true,
  }
)

const messageEmployeeSchema = new mongoose.Schema<IMessageEmployee, IMessageEmployeeModel>(
  {
    freelancer: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
    message: { type: mongoose.Types.ObjectId, ref: 'Message' },
    endDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: EJobStatus,
      default: EJobStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON)
messageSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The message's email
 * @param {ObjectId} [excludeMessageId] - The id of the message to be excluded
 * @returns {Promise<boolean>}
 */

messageSchema.pre('save', async function (next) {
  // const message = this
  // const user = await getUserById(message.user)
  // if (!user.isVerified) {
  //   throw new Error(`User is not verified`)
  // }
  next()
})

const Message = mongoose.model<IMessageDoc, IMessageModel>('Message', messageSchema)

export const MessageEmployee = mongoose.model<IMessageEmployee, IMessageEmployeeModel>(
  'MessageEmployee',
  messageEmployeeSchema
)

export default Message
