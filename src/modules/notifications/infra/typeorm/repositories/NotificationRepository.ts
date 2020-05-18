import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationDTO from '@modules/notifications/Dtos/INotificationDTO';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';

class NotificationRepository implements INotificationRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async createNotify({
    content,
    recipient_id,
  }: INotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationRepository;
