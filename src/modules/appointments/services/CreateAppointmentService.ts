import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICacheProvider from '@shared/provider/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const StartedDate = startOfHour(date);

    if (isBefore(StartedDate, Date.now()))
      throw new AppError(`You can't create an appointment on a past date.`);

    if (provider_id === user_id)
      throw new AppError("You can't create an appointment with yourself.");

    if (getHours(StartedDate) < 8 || getHours(StartedDate) > 17)
      throw new AppError(
        'You only can create appointments between 8am and 5pm.',
      );

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      StartedDate,
    );

    if (findAppointmentInSameDate)
      throw new AppError('This appointments is already booked');

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: StartedDate,
    });

    const dateFormated = format(StartedDate, "dd/MM/yyyy 'às' HH'h'mm");

    await this.notificationRepository.createNotify({
      recipient_id: provider_id,
      content: `Novo agendamento criado para o dia ${dateFormated}`,
    });

    await this.cacheProvider.invalidate(
      `appointments-provider:${provider_id}-${format(StartedDate, 'yyyy-M-d')}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
