import { ILevelSkill } from '@modules/skill/skill.interfaces'
import { getUserById } from '@modules/user/user.service'
import { ELevel } from 'common/enums'
import { IReview } from 'common/interfaces/subInterfaces'
import mongoose from 'mongoose'
import toJSON from '../../common/toJSON/toJSON'
import paginate from '../../providers/paginate/paginate'
import { IFreelancerDoc, IFreelancerModel } from './freelancer.interfaces'

const freelancerSchema = new mongoose.Schema<IFreelancerDoc, IFreelancerModel>(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    intro: {
      type: String,
      default: 'Nothing :))',
    },
    name: {
      type: String,
    },
    member: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    // tests: [{ type: mongoose.Types.ObjectId, ref: 'TestResult', default: [] }],
    skills: [
      {
        type: {
          skill: {
            type: mongoose.Types.ObjectId,
            ref: 'Skill',
          },
          level: {
            type: Number,
            enum: ELevel,
            default: ELevel.INTERMEDIATE,
          },
        } as unknown as ILevelSkill,
        default: [],
      },
    ],
    favoriteJobs: [{ type: mongoose.Types.ObjectId, ref: 'Job', default: [] }],
    certificate: {
      type: String,
      default: 'Nothing :))',
    },
    rating: {
      type: Number,
      default: 0,
    },
    proposals: [{ type: mongoose.Types.ObjectId, ref: 'Proposal', default: [] }],
    images: [{ type: String, required: 'false', default: [] }],
    reviews: [{ type: {} as IReview, default: [] }],
    preferJobType: [{ type: mongoose.Types.ObjectId, ref: 'JobCategory', default: [] }],
    currentLocations: [{ type: String, required: 'false', default: [] }],
    preferencesURL: [{ type: String, required: 'false', default: [] }],
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
freelancerSchema.plugin(toJSON)
freelancerSchema.plugin(paginate)

freelancerSchema.pre('save', async function (next) {
  const freelancer = this
  const user = await getUserById(freelancer.user)
  if (!user.isVerified) {
    throw new Error(`User is not verified`)
  }
  next()
})

freelancerSchema.pre('save', async function (done) {
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

const Freelancer = mongoose.model<IFreelancerDoc, IFreelancerModel>('Freelancer', freelancerSchema)

export default Freelancer
