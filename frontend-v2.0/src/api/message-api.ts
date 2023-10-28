// import { IMessage, IMessageQuery } from "src/types/Message";
import { Http, instance } from "./http";

// export const createMessage = (data?: Omit<
//   IMessage,
//   'status' | 'messages' | 'paymentHistory' | 'currentStatus'
// >) => {
//   return instance.post('Messages', data);
// }

// export const getMessages = (data: IMessageQuery) => {
//   return Http.get('Messages', data);
// }

// export const getMessage = (id: string) => {
//   return instance.get(`Messages/${id}`);
// }

// export const updateMessage = (data: Omit<IMessage, 'freelancer' | 'job'>, id: string) => {
//   return instance.patch(`Messages/${id}`, data);
// }

// export const deleteMessage = (id: string) => {
//   return instance.delete(`Messages/${id}`);
// }

// export const forcedDeleteMessage = (id: string) => {
//   return instance.delete(`Messages/admin/${id}`);
// }

export const getNotifies = (id: string) => {
  return Http.get('notify', {to: id});
}