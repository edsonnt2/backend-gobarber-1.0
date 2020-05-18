import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsDTO from '../Dtos/IAppointmentsDTO';
import IFindAllInMonthProviderDTO from '../Dtos/IFindAllInMonthProviderDTO';
import IFindAllInDayProviderDTO from '../Dtos/IFindAllInDayProviderDTO';

export default interface IAppointmentsRepository {
  findAllInMonthFromProvider(
    data: IFindAllInMonthProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayProviderDTO,
  ): Promise<Appointment[]>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  create(data: IAppointmentsDTO): Promise<Appointment>;
}
