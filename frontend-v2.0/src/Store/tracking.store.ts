import { createSubscription } from "src/libs/global-state-hook"

export enum ETrackingEvent {
  JOB_VIEW = 'JOB_VIEW',
  SEARCHING = 'SEARCHING',
  APPLY = 'APPLY',
  VIEWCLIENT = 'VIEWCLIENT',
}

export interface ITrackingEvent {
  [ETrackingEvent.JOB_VIEW]: {
    viewCount: number
    totalTimeView: number
  }
  [ETrackingEvent.SEARCHING]: {
    viewCount: number
    totalTimeView: number
  }
  [ETrackingEvent.APPLY]: {
    viewCount: number
    totalTimeView: number
  }
  [ETrackingEvent.VIEWCLIENT]: {
    viewCount: number
    totalTimeView: number
  }
}

export interface ITrackingData {
  id: string
  text: string
  lastTimeView: number
}

export interface IFreelancerTracking {
  jobs: ITrackingData[]
  skills: ITrackingData[]
  categories: ITrackingData[]
  locations: ITrackingData[]
}
export const locationStore = createSubscription<IFreelancerTracking>({} as IFreelancerTracking)