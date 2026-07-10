export type SocialLinks = {
  twitter?: string;
  instagram?: string;
  github?: string;
  website?: string;
  youtube?: string;
  tiktok?: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  social_links: SocialLinks;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  recipient_id: string;
  content: string;
  is_pinned: boolean;
  is_read: boolean;
  is_deleted_by_recipient: boolean;
  sender_ip: string | null;
  sender_user_agent: string | null;
  sender_device: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  message_id: string;
  reporter_id: string | null;
  reason: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
};

export type IpBan = {
  id: string;
  ip_address: string;
  reason: string | null;
  created_at: string;
  expires_at: string | null;
};

export type DeviceBan = {
  id: string;
  device_fingerprint: string;
  reason: string | null;
  created_at: string;
  expires_at: string | null;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  message_id: string | null;
  is_read: boolean;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  site_name: string;
  site_description: string;
  primary_color: string;
  allow_anonymous_messages: boolean;
  maintenance_mode: boolean;
  message_max_length: number;
  rate_limit_per_hour: number;
  created_at: string;
  updated_at: string;
};
