import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAppointmentsDTO from '@modules/appointments/Dtos/IAppointmentsDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllinMonthProviderDTO from '@modules/appointments/Dtos/IFindAllInMonthProviderDTO';
import IFindAllinDayProviderDTO from '@modules/appointments/Dtos/IFindAllInDayProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointmentDate = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointmentDate;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllinMonthProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointmentAvailable = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateAppointment =>
            `to_char(${dateAppointment}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointmentAvailable;
  }

  public async findAllInDayFromProvider({
    provider_id,
    month,
    year,
    day,
  }: IFindAllinDayProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const appointmentAvailable = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateAppointment =>
            `to_char(${dateAppointment}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointmentAvailable;
  }

  public async create(data: IAppointmentsDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create(data);

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
