import { EPaymentMethod, EPaymentPurpose } from "src/utils/enum";
import { Http, instance } from "./http";

export interface IPayment {
  purpose: EPaymentPurpose
  from: string
  to?: string
  isToAdmin?: boolean
  amount?: number
  status?: string
  paymentMethod?: EPaymentMethod
  note?: string
}

export const buySickPoints = (data: IPayment, sickPoints: number, buyer: string) => {
  return instance.post('payments/buysick', {...data, sickPoints, buyer});
}