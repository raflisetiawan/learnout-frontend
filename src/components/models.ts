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
