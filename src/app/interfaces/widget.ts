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
  position: number | null;
  grid_col: number | null;
  grid_row: number | null;
  can_edit: boolean;
}

export interface WidgetLayoutItem {
  family_widget_id: number;
  position: number;
  grid_col: number;
  grid_row: number;
}

export interface WidgetLayoutResponse {
  configs: Array<{
    id: number;
    user_id: number;
    family_widget_id: number;
    position: number;
    grid_col: number;
    grid_row: number;
  }>;
}