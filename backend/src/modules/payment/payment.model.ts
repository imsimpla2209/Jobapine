import { EStatus, EPaymentMethod } from 'common/enums'
import mongoose from 'mongoose'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { IPaymentDoc, IPaymentContract, IPaymentContractModel, IPaymentModel } from './payment.interfaces'

const paymentSchema = new mongoose.Schema<IPaymentDoc, IPaymentModel>(
  {
    from: { type: mongoose.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Types.ObjectId, ref: 'User' },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: EStatus,
      default: EStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: EPaymentMethod,
      default: EPaymentMethod.VNPAY,
    },
  },
  {
    timestamps: true,
  }
)

const paymentContractSchema = new mongoose.Schema<IPaymentContract, IPaymentContractModel>({
  contract: { type: mongoose.Types.ObjectId, ref: 'Contract' },
  payment: { type: mongoose.Types.ObjectId, ref: 'Payment' },
})

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON)
paymentSchema.plugin(paginate)

const Payment = mongoose.model<IPaymentDoc, IPaymentModel>('Payment', paymentSchema)

export const PaymentContract = mongoose.model<IPaymentContract, IPaymentContractModel>(
  'PaymentContract',
  paymentContractSchema
)

export default Payment
