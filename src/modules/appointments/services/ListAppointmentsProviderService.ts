import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/provider/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListAppointmentsProviderService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      `appointments-provider:${provider_id}-${year}-${month}-${day}`,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        { provider_id, day, month, year },
      );

      await this.cacheProvider.save(
        `appointments-provider:${provider_id}-${year}-${month}-${day}`,
        appointments,
      );
    }

    return appointments;
  }
}

export default ListAppointmentsProviderService;
