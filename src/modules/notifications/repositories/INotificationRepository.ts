import INotificationDTO from '../Dtos/INotificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationRepository {
  createNotify(data: INotificationDTO): Promise<Notification>;
}
