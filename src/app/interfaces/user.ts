
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_system_admin: boolean;
  created_at: string;
}

export const FAMILY_ROLES = ['Familyadmin', 'Guest', 'SystemAdmin'] as const;
export type FamilyRoleName = (typeof FAMILY_ROLES)[number];

export function isFamilyRoleName(value: unknown): value is FamilyRoleName {
  return typeof value === 'string' && (FAMILY_ROLES as readonly string[]).includes(value);
}

export interface FamilyMembership {
  family: { id: number; name: string; created_at: string };
  role: { id: number; name: FamilyRoleName };
}

export interface FamiliesResponse {
  families: FamilyMembership[];
}

export interface FamilyMember {
  id: number;
  user_id: number;
  family_id: number;
  role_id: number;
  user_username: string;
  role_name: FamilyRoleName;
}

export interface FamilyDetailResponse {
  members: FamilyMember[];
}