import { User } from './user';

export interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
}
