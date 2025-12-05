import { Repository, In } from 'typeorm';
import { Notification } from '../Domain/models/Notification';
import { INotificationRepository } from '../Domain/services/INotificationRepository';

export class NotificationRepository implements INotificationRepository {
  
  private repository: Repository<Notification>;

  constructor(repository: Repository<Notification>) {
    this.repository = repository;
  }

  // kreira Notification entitet (ne snima u bazu)
  create(notification: Partial<Notification>): Notification {
    return this.repository.create(notification);
  }

  // snima notifikaciju u bazu
  async save(notification: Notification): Promise<Notification> {
    return await this.repository.save(notification);
  }

  // vraca sve notifikacije
  async findAll(): Promise<Notification[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' }
    });
  }

  // vraca notifikaciju po ID-u
  async findOne(id: number): Promise<Notification | null> {
    return await this.repository.findOne({ where: { id } });
  }

  // vraca notifikacije za odredjenog korisnika
  async findByUserId(userId: number): Promise<Notification[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  // brise notifikaciju
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  // brise vise notifikacija odjednom
  async deleteMultiple(ids: number[]): Promise<void> {
    await this.repository.delete(ids);
  }

  // azurira vise notifikacija odjednom
  async updateMultiple(ids: number[], data: Partial<Notification>): Promise<void> {
    await this.repository.update({ id: In(ids) }, data);
  }

  // vraca broj neprocitanih notifikacija
  async countUnread(userId: number): Promise<number> {
    return await this.repository.count({
      where: { userId, isRead: false }
    });
  }
}