import { Type } from '@angular/core';

export interface WidgetPermissions {
  read: boolean;
  write: boolean;
}

export interface Widget {
  id: number;
  label: string;
  content: Type<unknown>;
  permissions: WidgetPermissions;
  rows?: number;
  cols?: number;
  backgroundColor?: string;
  color?: string;
}

export interface WidgetRolePermission {
  id: number;
  family_widget_id: number;
  role_id: number;
  role_name: string | null;
  can_view: boolean;
  can_edit: boolean;
}

export interface FamilyWidgetDetailed {
  id: number;
  family_id: number;
  widget_type_id: number;
  widget_key: string | null;
  is_enabled: boolean;
  display_name: string | null;
  description: string | null;
  permissions: WidgetRolePermission[];
}