import { User } from './user';

export interface LoginResponse {
  message: string;
  user: User;
  families: Array<{ family_id: number; is_admin: boolean }>;
}
