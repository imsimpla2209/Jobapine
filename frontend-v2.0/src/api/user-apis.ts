import { IUser, IUserQuery } from "src/types/user";
import { Http, instance } from "./http";

export const createUser = (data?: Omit<
  IUser,
  'refreshToken' | 'paymentInfo' | 'isVerified' | 'isActive' | 'lastLoginAs' | 'balance' | 'sickPoints'
>) => {
  return instance.post('users', data);
}

export const getUsers = (data: IUserQuery) => {
  return Http.get('users', data);
}

export const getUser = (id: string) => {
  return instance.get(`users:${id}`);
}

export const updateUser = (data: Omit<
  IUser,
  'refreshToken' | 'isVerified' | 'isActive' | 'lastLoginAs' | 'balance' | 'sickPoints'
>, id: string) => {
  return instance.patch(`users:${id}`, data);
}

export const deleteUser = (id: string) => {
  return instance.delete(`users/${id}`);
}

export const forcedDeleteUser = (id: string) => {
  return instance.delete(`users/admin/:${id}`);
}

export const switchToFreelancer = () => {
  return instance.get(`users/to-freelancer`);
}

export const switchToClient = () => {
  return instance.get(`users/to-client`);
}