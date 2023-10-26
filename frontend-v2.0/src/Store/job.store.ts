import { createSubscription } from "libs/global-state-hook"
import { IClient } from "src/types/client"
import { IFreelancer } from "src/types/freelancer"
import { IJobPayment, IJobPreferences, IJobScope } from "src/types/job"
import { EUserVisibility } from "src/utils/enum"

export interface IJobData {
  _id: string
  client: any
  title: string
  description?: string
  type: string
  experienceLevel?: string[]
  reqSkills?: any[]
  checkLists?: string[]
  attachments?: string[]
  categories?: any[]
  budget?: number
  tags?: any[]
  status?: [
    {
      status: string
      date: Date
      comment?: string
    }
  ]
  proposals?: any[]
  payment?: IJobPayment
  scope?: IJobScope
  questions?: string[]
  createdAt?: any
  updateddAt?: any
  preferences?: IJobPreferences
  visibility?: EUserVisibility
  jobDuration?: 'short-term' | 'long-term'
}

export const jobsDataStore = createSubscription<IJobData[]>([])


export enum EJobFilter {
  RCMD = 'rcmd',
  RECENT = 'recent',
  OTHER = 'other'
}

export const jobLoad = createSubscription<
  {
    filter: string,
    isFirstLoad: boolean,
    page: number,
    categories: string[],
    skills: string[],
    pageSize: number,
  }>({
    filter: 'rcmd',
    isFirstLoad: true,
    page: 1,
    categories: [],
    skills: [],
    pageSize: 20,
  })

export const refreshStore = createSubscription<{ isRefresh: boolean }>({ isRefresh: false })


export const freelancerStore = createSubscription<IFreelancer>({
  _id: "",
  user: "",
  name: "",
  intro: '',
  members: [],
  // tests: ITestDoc['_id'][]
  skills: [],
  certificate: '',
  proposals: [],
  images: [],
  reviews: [],
  favoriteJobs: [],
  preferJobType: [],
  currentLocations: [],
  preferencesURL: [],
  rating: 0,
  jobsDone: { number: 0, success: 0 },
  earned: 0,
  available: false,
})

export const clientStore = createSubscription<IClient>({
  user: "",
  name: "",
  intro: '',
  organization: '',
  // tests: ITestDoc['_id'][]
  images: [],
  reviews: [],
  favoriteFreelancers: [],
  preferJobType: [],
  preferLocations: [],
  preferencesURL: [],
  rating: 0,
  jobs: [],
  spent: 0,
  paymentVerified: false,
})

export const emptyFilterOptions = {
  complexity: null,
  categories: null,
  skills: null,
  locations: null,
  paymentType: null,
  currentStatus: null,
  duration: null,
  budget: null,
  paymentAmount: null,
  proposals: null,
  nOEmployee: null,
}

export const advancedSearchJobs = createSubscription<
  {
    complexity: any[],
    categories: string[],
    skills: string[],
    locations: any[],
    paymentType: any[],
    currentStatus: any[],
    duration: { from: number, to: number },
    budget: { from: number, to: number },
    paymentAmount: { from: number, to: number },
    proposals: { from: number, to: number },
    nOEmployee: { from: number, to: number },
  }>(emptyFilterOptions)

export const advancedSearchPage = createSubscription<{
  isFirstLoad: boolean,
  page: number,
  pageSize: number
}>({
  isFirstLoad: true,
  page: 1,
  pageSize: 20,
})
