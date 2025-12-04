export interface NotificationCreateDTO {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error';
  userId?: number;
}

export class NotificatioCreateRequest implements NotificationCreateDTO {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error';
  userId?: number;

  constructor(title: string, content: string, type: 'info' | 'warning' | 'error', userId?: number) {
    this.title = title;
    this.content = content;
    this.type = type;
    this.userId = userId;
  }
}