import mongoose from 'mongoose'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { ISkillDoc, ISkillModel } from './skill.interfaces'

const skillSchema = new mongoose.Schema<ISkillDoc, ISkillModel>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
skillSchema.plugin(toJSON)
skillSchema.plugin(paginate)

skillSchema.pre('deleteOne', async function (next) {
  // const job = this
  // const user = await getUserById(skill.user)
  // if (!user.isVerified) {
  //   throw new Error(`User is not verified`)
  // }
  next()
})

const Skill = mongoose.model<ISkillDoc, ISkillModel>('Skill', skillSchema)

export default Skill
