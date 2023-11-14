import { IProposal, IProposalQuery } from 'src/types/proposal'
import { Http, instance } from './http'

export const createProposal = (
  data?: Omit<IProposal, 'status' | 'messages' | 'contract' | 'freelancerComment' | 'clientComment' | 'currentStatus'>
) => {
  return instance.post('proposals', data)
}

export const getProposals = (data: IProposalQuery) => {
  return Http.get('proposals', data)
}

export const getProposal = (id: string) => {
  return instance.get(`proposals/${id}`)
}

export const getAllProposalInJob = (id: string) => {
  return instance.get(`proposals?job=${id}`)
}

export const updateProposal = (data: Omit<IProposal, 'freelancer' | 'job'>, id: string) => {
  return instance.patch(`proposals/${id}`, data)
}

export const deleteProposal = (id: string) => {
  return instance.delete(`proposals/${id}`)
}

export const forcedDeleteProposal = (id: string) => {
  return instance.delete(`proposals/admin/${id}`)
}
