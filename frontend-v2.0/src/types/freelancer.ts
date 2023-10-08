export interface SkillBody {
  skill: string;
  level: number;
}

export interface NewRegisteredFreelancer {
  user: string;
  name: string;
  intro?: string;
  skills: SkillBody[];
  certificate?: string;
  images: string[];
  preferJobType: string[];
  currentLocations: string[];
  preferencesURL: string[];
}

export interface UpdateFreelancer {
  name: string;
  intro: string;
  skills: SkillBody[];
  certificate: string;
  images: string[];
  preferJobType: string[];
  currentLocations: string[];
  preferencesURL: string[];
  available: boolean;
}

export interface QueryParams {
  name?: string;
  skills?: SkillBody[];
  preferJobType?: string[];
  currentLocations?: string[];
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
}

export interface filterFreelancersBody {
  name?: string;
  intro?: string;
  skills?: SkillBody[];
  preferJobType?: string[];
  currentLocations?: string[];
  'jobsDone.number'?: number;
  'jobsDone.success'?: number;
  earned?: number;
  rating?: number;
  available?: boolean;
}

export interface filterFreelancersQuery {
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
}

export interface IReview {
  creator: string;
  content: string;
  rating?: number;
  isAnonymous?: boolean;
}