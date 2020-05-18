import { ObjectId } from 'mongodb';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationDTO from '@modules/notifications/Dtos/INotificationDTO';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';

class FakeNotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  public async createNotify(data: INotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectId() }, data);

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationRepository;
