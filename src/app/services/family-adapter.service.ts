import { Injectable } from '@angular/core';
import { FamilyMembership, FamilyRoleName } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class FamilyAdapterService {
  normalizeFamiliesResponse(response: unknown): FamilyMembership[] {
    const entries = this.extractFamilyEntries(response);
    return entries
      .map((entry) => this.normalizeMembership(entry))
      .filter((entry): entry is FamilyMembership => entry !== null);
  }

  private extractFamilyEntries(response: unknown): unknown[] {
    if (Array.isArray(response)) return response;
    if (!response || typeof response !== 'object') return [];
    const typed = response as { families?: unknown };
    if (Array.isArray(typed.families)) return typed.families;
    return [];
  }

  private normalizeMembership(entry: unknown): FamilyMembership | null {
    if (!entry || typeof entry !== 'object') return null;

    const item = entry as Record<string, unknown>;
    const familyData =
      item['family'] && typeof item['family'] === 'object'
        ? (item['family'] as Record<string, unknown>)
        : item;
    const roleData =
      item['role'] && typeof item['role'] === 'object'
        ? (item['role'] as Record<string, unknown>)
        : null;

    const familyId = this.toPositiveNumber(
      familyData['id'] ?? familyData['family_id'] ?? familyData['familyId'] ?? item['family_id'] ?? item['familyId'],
    );
    if (!familyId) return null;

    const roleNameRaw = roleData?.['name'] ?? item['role_name'] ?? item['roleName'];

    return {
      family: {
        id: familyId,
        name: String(familyData['name'] ?? item['family_name'] ?? item['familyName'] ?? `Familie ${familyId}`),
        created_at: String(familyData['created_at'] ?? familyData['createdAt'] ?? item['created_at'] ?? item['createdAt'] ?? ''),
      },
      role: {
        id: this.toPositiveNumber(roleData?.['id'] ?? item['role_id'] ?? item['roleId']) ?? 0,
        name: this.toFamilyRoleName(roleNameRaw),
      },
    };
  }

  private toPositiveNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return null;
  }

  private toFamilyRoleName(value: unknown): FamilyRoleName {
    if (value === 'Familyadmin' || value === 'Guest' || value === 'SystemAdmin') return value;
    return 'Guest';
  }
}
