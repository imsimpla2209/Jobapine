import { IContract, IContractQuery } from "src/types/contract";
import { Http, instance } from "./http";

export const createContract = (data?: Omit<
  IContract,
  'status' | 'messages' | 'paymentHistory' | 'currentStatus'
>) => {
  return instance.post('contracts', data);
}

export const getContracts = (data: IContractQuery) => {
  return Http.get('contracts', data);
}

export const getContract = (id: string) => {
  return instance.get(`contracts/${id}`);
}

export const updateContract = (data: Omit<IContract, 'freelancer' | 'job'>, id: string) => {
  return instance.patch(`contracts/${id}`, data);
}

export const deleteContract = (id: string) => {
  return instance.delete(`contracts/${id}`);
}

export const forcedDeleteContract = (id: string) => {
  return instance.delete(`contracts/admin/${id}`);
}