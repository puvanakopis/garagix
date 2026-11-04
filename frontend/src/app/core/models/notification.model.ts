export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'repair_update' | 'alert' | 'system';
  createdAt: string;
  read: boolean;
  linkUrl?: string;
}

