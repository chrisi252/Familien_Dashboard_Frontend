export interface AdminFamily {
  id: number;
  name: string;
  created_at: string;
  member_count?: number;
}

export interface UserFamily {
  family: { id: number; name: string; created_at: string };
  role: { id: number; name: string };
}

export interface UserWithFamilies {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_system_admin: boolean;
  created_at: string;
  families: UserFamily[];
}

export interface AdminUsersResponse {
  users: UserWithFamilies[];
}

export interface AdminFamiliesResponse {
  families: AdminFamily[];
}

export interface AdminCreateAccountRequest {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AdminCreateAccountResponse {
  message: string;
  user: {
    id: number;
    username: string;
    is_system_admin: boolean;
    first_name: string;
    last_name: string;
    created_at: string;
  };
}