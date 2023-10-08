import { IAdvancedGetJobsBody, IAdvancedGetJobsQuery, ICreateJobBody, IGetJobsQuery } from "src/types/job";
import { Http, instance } from "./http";
import { IReview } from "src/types/freelancer";
import { EJobStatus } from "src/utils/enum";

export const createJob = (data: ICreateJobBody) => {
  return instance.post('jobs', data);
}

export const getJobs = (data: IGetJobsQuery ) => {
  return Http.get('jobs', data);
}

export const filterJobs = (data: IAdvancedGetJobsBody, query: IAdvancedGetJobsQuery ) => {
  return Http.post('jobs/filter', data, query);
}

export const searchJobs = (data: {searchText: string}, query: IAdvancedGetJobsQuery ) => {
  return Http.post('jobs/search', data, query);
}

export const getRcmdJobs = (data: {jobId: string}, query: IAdvancedGetJobsQuery ) => {
  return Http.post('jobs/rcmd', data, query);
}

export const getJob = (id: string ) => {
  return instance.get(`jobs:${id}`);
}

export const updateJob = (data: Omit<ICreateJobBody, 'client'>, id: string ) => {
  return instance.patch(`jobs:${id}`, data);
}

export const deleteJob = (id: string) => {
  return instance.delete(`jobs/${id}`);
}

export const reviewJob = (data: IReview, id: string ) => {
  return instance.patch(`jobs/review/${id}`, data);
}

export const changeStatus = (data: {status: EJobStatus, comment?: string }, id: string ) => {
  return instance.patch(`jobs/status/:${id}`, data);
}

export const forcedDeleteJob = (id: string) => {
  return instance.delete(`jobs/admin/:${id}`);
}