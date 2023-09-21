import { getUserById } from '@modules/user/user.service'
import { IReview } from 'common/interfaces/subInterfaces'
import mongoose from 'mongoose'
import toJSON from '../../common/toJSON/toJSON'
import paginate from '../../providers/paginate/paginate'
import { IClientDoc, IClientModel } from './client.interfaces'

const clientSchema = new mongoose.Schema<IClientDoc, IClientModel>(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    intro: {
      type: String,
      default: 'Nothing :))',
    },
    rating: {
      type: Number,
      index: true,
      default: 0,
    },
    jobs: [{ type: mongoose.Types.ObjectId, required: 'false', ref: 'Job', default: [] }],
    organization: [{ type: mongoose.Types.ObjectId, required: 'false', ref: 'Organization', default: [] }],
    images: [{ type: String, required: 'false', default: [] }],
    reviews: [{ type: {} as IReview, default: [] }],
    preferJobType: [{ type: mongoose.Types.ObjectId, ref: 'JobCategory', default: [] }],
    preferLocations: [{ type: String, required: 'false', default: [] }],
    preferencesURL: [{ type: String, required: 'false', default: [] }],
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
clientSchema.plugin(toJSON)
clientSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The client's email
 * @param {ObjectId} [excludeClientId] - The id of the client to be excluded
 * @returns {Promise<boolean>}
 */
clientSchema.static('isUserSigned', async function (user_id: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await getUserById(user_id)
  return !!user
})

clientSchema.pre('save', async function (next) {
  const client = this
  const user = await getUserById(client.user)
  if (!user.isVerified) {
    throw new Error(`User is not verified`)
  }
  next()
})

const Client = mongoose.model<IClientDoc, IClientModel>('Client', clientSchema)

export default Client
