import { EPaymenType, EComplexity } from "src/utils/enum";

export interface IJobPayment {
  amount?: number;
  type?: EPaymenType;
}

export interface IJobScope {
  complexity?: EComplexity;
  duration?: number;
}

export interface IJobPreferences {
  nOEmployee?: number;
  locations?: string[];
}

export interface ICreateJobBody {
  client: string;
  title: string;
  description?: string;
  reqSkills?: string[];
  checkLists?: string[];
  attachments?: string[];
  categories?: string[];6666
  budget?: number;
  tags?: string[];
  payment?: IJobPayment;
  scope?: IJobScope;
  questions?: string[];
  preferences?: IJobPreferences;
}

export interface IGetJobsQuery {
  title?: string;
  nOEmployee?: number;
  complexity?: string;
  duration?: number;
  description?: string;
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
}

export interface IAdvancedGetJobsBody {
  title?: string;
  ['preferences.nOEmployee']?: { from?: number; to?: number };
  ['preferences.locations']?: string[];
  ['scope.complexity']?: number[];
  ['scope.duration']?: { from?: number; to?: number };
  ['payment.amount']?: { from?: number; to?: number };
  proposals?: { from?: number; to?: number };
  clientInfo?: string[];
  clientHistory?: string;
  ['payment.type']?: EPaymenType[];
  description?: string;
  budget?: { from?: number; to?: number };
  categories?: string[];
  tags?: string[];
  currentStatus?: string[];
}

export interface IAdvancedGetJobsQuery {
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
}