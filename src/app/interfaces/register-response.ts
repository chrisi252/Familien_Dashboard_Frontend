import { User } from './user';

export interface RegisterResponse {
  message: string;
  access_token: string;
  user: User;
}
