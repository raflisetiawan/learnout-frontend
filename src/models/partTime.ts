import { CategoryInfo, CompanyInfo } from 'src/components/models';
import { JobTypeSelect } from './job';

export type PartTimeJobType = {
  id: number;
  company_id: number;
  jobtype_id: number;
  jobtypes: JobTypeSelect;
  title: string;
  description: string;
  province: string;
  location: string;
  regency: string;
  district: string;
  schedule: string;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
  isClosed?: number;
  company: CompanyInfo;
  categories: CategoryInfo[];
};
