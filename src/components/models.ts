export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  password: string;
  rememberToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProvincesInfo {
  id: number;
  name: string;
  value: number;
  label: string;
}
export interface RegenciesInfo {
  id: number;
  name: string;
  value: number;
  label: string;
}
export interface DisctrictInfo {
  id: number;
  name: string;
  value: number;
  label: string;
}

export interface UniversitiesInfo {
  id: number;
  name: string;
  location: string;
  regency: string;
  district: string;
}
export interface CategoriesInfo {
  id: number;
  name: string;
}
