export interface JobType {
  name: string;
  id: number;
  created_at?: Date;
  updatedAt_at?: Date;
}
export interface JobTypeSelect extends JobType {
  value: number;
  label: string;
}

export interface JobApplicationRequisite {
  is_cover_letter: boolean;
  is_transcript: boolean;
  is_recommendation_letter: boolean;
  is_proposal: boolean;
  is_resume: boolean;
  is_health_insurance: boolean;
}
export interface JobApplicationRequisiteBooleanFormat {
  id: number;
  is_cover_letter: boolean;
  is_transcript: boolean;
  is_recommendation_letter: boolean;
  is_proposal: boolean;
  is_resume: boolean;
  is_health_insurance: boolean;
  joblisting_id?: number;
  created_at?: string;
  updated_at?: string;
}
