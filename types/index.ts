export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  office_id: string;
  team_id: string;
  manager_id?: string;
  role: UserRole;
  active: boolean;
  job_title?: string;
}

export interface Office {
  id: string;
  name: string;
  code: string;
  timezone: string;
}

export interface Team {
  id: string;
  name: string;
  slack_channel_id?: string;
  slack_channel_name?: string;
}

export interface CompanyValue {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

export interface KudosReply {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface Kudos {
  id: string;
  giver_id: string;
  recipient_ids: string[];
  message: string;
  value_id?: string;
  visibility: 'team' | 'company' | 'private';
  channel_id?: string;
  source: 'slash' | 'shortcut' | 'app_home';
  source_message_id?: string;
  source_message_preview?: string;
  compose_ms: number;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  reactions: Record<string, string[]>; // emoji -> user_ids[]
  replies: KudosReply[];
}

export interface ComposerEvent {
  id: string;
  user_id: string;
  opened_at: string;
  sent: boolean;
  kudos_id?: string;
}

export interface SlackMessage {
  id: string;
  channel_id: string; // channel id or dm id
  author_id: string; // user id or 'bot-kudos'
  content: string;
  created_at: string;
  kudos_id?: string;
  is_dm?: boolean;
  target_user_id?: string; // for DMs
  reactions: Record<string, string[]>;
  replies: {
    id: string;
    author_id: string;
    content: string;
    created_at: string;
  }[];
}

export interface SystemRule {
  min_length: number;
  edit_window_minutes: number;
  default_visibility: 'team' | 'company' | 'private';
}
