export interface User {
  uid: string;
  username: string;
  email?: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  needsAuthAccount?: boolean;
  needsPasswordChange?: boolean;
}

export interface UserCreate {
  username: string;
  password: string;
  email?: string;
  displayName?: string;
  role: 'admin' | 'user';
} 