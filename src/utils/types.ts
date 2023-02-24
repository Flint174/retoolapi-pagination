export interface UserInfo {
  name: string;
  email: string;
  lastName: string;
  birthDate: string;
}
export interface UserMeta {
  id: string;
  access: boolean;
}

export type User = UserMeta & Partial<UserInfo>;
