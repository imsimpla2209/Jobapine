export interface NewRegisteredClient {
  user: string;
  intro?: string;
  name: string;
  organization?: string;
  preferencesURL?: string[];
  preferLocations?: string[];
  preferJobType?: string[];
  favoriteFreelancers?: string[];
}

export interface IQueryParams {
  name?: string;
  rating?: {
    from?: number;
    to?: number;
  };
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
}

export interface IUpdateClientBody {
  intro?: string;
  name?: string;
  organization?: string;
  preferencesURL?: string[];
  preferLocations?: string[];
  preferJobType?: string[];
  favoriteFreelancers?: string[];
}