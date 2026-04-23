export interface ChatMessage {
  id: number;
  family_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  text: string;
  created_at: string;
}

export interface OnlineMember {
  user_id: number;
  first_name: string;
  last_name: string;
}
