export interface NotificationUpdateDTO {
  title?: string;
  content?: string;
  type?: 'info' | 'warning' | 'error';
  isRead?: boolean;
}

export class UpdateNotificationRequest implements NotificationUpdateDTO {
  title?: string;
  content?: string;
  type?: 'info' | 'warning' | 'error';
  isRead?: boolean;

  constructor(data: NotificationUpdateDTO) {
    this.title = data.title;
    this.content = data.content;
    this.type = data.type;
    this.isRead = data.isRead;
  }
}