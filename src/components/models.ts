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
  emailVerifiedAt: string | null;
  password: string;
  rememberToken: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  image: string | null;
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

export interface CompanyInfo {
  id: string | number;
  userId: string | number;
  name: string;
  description: string;
  location: string;
  website: string;
  email: string;
  phone: number | string;
  regency: string;
  district: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobInfo {
  id: number;
  title: string;
  description: string;
  location: string;
  regency: string;
  district: string;
  schedule: string;
  start_time: string; //time hour minute
  end_time: string; //time hour minute
  category: CategoryInfo[];
  created_at: Date;
  updated_at: Date;
}

export interface CategoryInfo {
  id: number;
  name: string;
  value: number;
  label: string;
}

export interface StudentInfo {
  id: number;
  userId: number;
  name: string;
  address: string;
  phone: string;
  regency: string;
  district: string;
  university_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface JobsInfo {
  title: string;
  description: string;
  location: string;
  regency: string;
  district: string;
  schedule: string;
  start_time: string; //time hour minute
  end_time: string; //time hour minute
  category: CategoryInfo[];
}

export interface JobWithCompanyWithCategoriesInfo {
  id: number;
  title: string;
  description: string;
  location: string;
  regency: string;
  district: string;
  schedule: string;
  start_time: string; //time hour minute
  end_time: string; //time hour minute
  created_at: Date;
  updated_at: Date;
  company: CompanyInfo;
  company_id: number;
  categories: CategoryInfo[];
}

export interface ApplicationInfo {
  id: number;
  student_id: number;
  joblisting_id: number;
  cover_letter: string[] | File[] | FileList | null | undefined;
  resume: string[] | File[] | FileList | null | undefined;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface SubmitError {
  isError: boolean;
  message: string;
}
