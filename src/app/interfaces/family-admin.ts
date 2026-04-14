export interface AdminFamily {
  id: number;
  name: string;
  created_at: string;
  member_count?: number;
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