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
    paymentVerified: { type: Boolean, default: false },
    favoriteFreelancers: [{ type: mongoose.Types.ObjectId, required: 'false', ref: 'Freelancer', default: [] }],
    spent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
clientSchema.plugin(toJSON)
clientSchema.plugin(paginate)

clientSchema.index({ name: 'text' })

/**
 * Check if email is taken
 * @param {string} email - The client's email
 * @param {ObjectId} [excludeClientId] - The id of the client to be excluded
 * @returns {Promise<boolean>}
 */
clientSchema.static('isUserSigned', async function (user_id: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ user: user_id })
  return !!user
})

clientSchema.pre('save', async function (done) {
  if (this.isModified('review')) {
    const review = await this.get('review')
    const currRating = await this.get('rating')
    const newRating =
      !!currRating && !!review?.length
        ? (currRating + Number(review.pop()?.rating)) / (review?.length || 1)
        : Number(review.pop()?.rating)
    this.set('rating', newRating)
  }
  done()
})

const Client = mongoose.model<IClientDoc, IClientModel>('Client', clientSchema)

export default Client
