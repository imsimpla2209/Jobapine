import { EStatus } from "src/utils/enum";
import { filterFreelancersQuery } from "./freelancer";

export interface IProposal {
  job: string;
  freelancer: string;
  expectedAmount?: number
  description?: string
  status?: [{ status: EStatus; date: Date }]
  clientComment?: string[]
  freelancerComment?: string[]
  attachments?: string[]
  contract?: string
  messages?: string[]
  answers?: Record<number, string>
  priority?: number
  currentStatus?: string
}

export interface IProposalQuery extends filterFreelancersQuery{
  job?: string,
  _id?: string,
  'status.status'?: EStatus,
}