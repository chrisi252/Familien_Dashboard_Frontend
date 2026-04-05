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

export interface WidgetUserPermission {
  id: number;
  family_widget_id: number;
  user_id: number;
  can_view: boolean;
  can_edit: boolean;
}

export interface FamilyWidgetDetailed {
  id: number;
  family_id: number;
  widget_type_id: number;
  widget_key: string | null;
  display_name: string | null;
  description: string | null;
  is_enabled: boolean;
  grid_col: number;
  grid_row: number;
  grid_pos_x: number;
  grid_pos_y: number;
  can_edit: boolean;
  permissions: WidgetRolePermission[];
}