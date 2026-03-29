
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}

export type FamilyRoleName = 'Familyadmin' | 'Guest' | 'SystemAdmin';

export interface FamilyMembership {
  family: { id: number; name: string; created_at: string };
  role: { id: number; name: FamilyRoleName };
}