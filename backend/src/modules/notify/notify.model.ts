import mongoose from 'mongoose'
import toJSON from '../../common/toJSON/toJSON'
import paginate from '../../providers/paginate/paginate'
import { INotifyDoc, INotifyModel } from './notify.interfaces'

const notifySchema = new mongoose.Schema<INotifyDoc, INotifyModel>(
  {
    to: { type: mongoose.Types.ObjectId, ref: 'User' },
    path: { type: String, default: '' },
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    content: {
      type: String,
      required: true,
    },
    image: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

// const notifyRoomSchema = new mongoose.Schema<INotifyRoomDoc, INotifyRoomModel>(
//   {
//     isDeleted: { type: Boolean, default: false },
//     proposal: { type: mongoose.Types.ObjectId, ref: 'Proposal' },
//     members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
//     proposalStatusCatalog: [{ type: String, required: 'false', default: [] }],
//     background: {
//       type: String,
//       default: '',
//     },
//     image: {
//       type: String,
//       default: '',
//     },
//     status: [
//       {
//         type: {
//           status: {
//             type: String,
//             enum: EStatus,
//           },
//           date: {
//             type: Date,
//           },
//           comment: {
//             type: String,
//           },
//         },
//         default: {
//           date: new Date(),
//           status: EStatus.PENDING,
//           comment: '',
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// )

// add plugin that converts mongoose to json
notifySchema.plugin(toJSON)
notifySchema.plugin(paginate)

// // add plugin that converts mongoose to json
// notifyRoomSchema.plugin(toJSON)
// notifyRoomSchema.plugin(paginate)

notifySchema.pre('save', async function (next) {
  // const notify = this
  // const user = await getUserById(notify.user)
  // if (!user.isVerified) {
  //   throw new Error(`User is not verified`)
  // }
  next()
})

const Notify = mongoose.model<INotifyDoc, INotifyModel>('Notify', notifySchema)

// export const NotifyRoom = mongoose.model<INotifyRoom, INotifyRoomModel>('NotifyRoom', notifyRoomSchema)

export default Notify
