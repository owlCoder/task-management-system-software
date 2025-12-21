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
    try {
      return this.repository.create(notification);
    } catch (error) {
      console.error(' Repository.create error:', error);
      throw error; // create ne bi trebao pasti, ali za svaki slučaj
    }
  }

  // snima notifikaciju u bazu
  async save(notification: Notification): Promise<Notification | null> {
    try {
      return await this.repository.save(notification);
    } catch (error) {
      console.error(' Repository.save error:', error);
      return null;
    }
  }

  // vraca sve notifikacije
  async findAll(): Promise<Notification[]> {
    try {
      return await this.repository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error(' Repository.findAll error:', error);
      return [];
    }
  }

  // vraca notifikaciju po ID-u
  async findOne(id: number): Promise<Notification | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      console.error(' Repository.findOne error:', error);
      return null;
    }
  }

  // vraca notifikacije za odredjenog korisnika
  async findByUserId(userId: number): Promise<Notification[]> {
    try {
      return await this.repository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      console.error(' Repository.findByUserId error:', error);
      return [];
    }
  }

  // brise notifikaciju
  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error(' Repository.delete error:', error);
      return false;
    }
  }

  // brise vise notifikacija odjednom
  async deleteMultiple(ids: number[]): Promise<boolean> {
    try {
      const result = await this.repository.delete(ids);
      return result.affected !== 0;
    } catch (error) {
      console.error(' Repository.deleteMultiple error:', error);
      return false;
    }
  }

  // azurira vise notifikacija odjednom
  async updateMultiple(ids: number[], data: Partial<Notification>): Promise<boolean> {
    try {
      const result = await this.repository.update({ id: In(ids) }, data);
      return result.affected !== 0;
    } catch (error) {
      console.error(' Repository.updateMultiple error:', error);
      return false;
    }
  }

  // vraca broj neprocitanih notifikacija
  async countUnread(userId: number): Promise<number> {
    try {
      return await this.repository.count({
        where: { userId, isRead: false }
      });
    } catch (error) {
      console.error(' Repository.countUnread error:', error);
      return 0;
    }
  }
}
