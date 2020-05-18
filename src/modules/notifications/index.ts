import { container } from 'tsyringe';

import INotificationRepository from './repositories/INotificationRepository';
import NotificationRepository from './infra/typeorm/repositories/NotificationRepository';

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository,
);
