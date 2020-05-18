import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAppointmentsDTO from '@modules/appointments/Dtos/IAppointmentsDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllinMonthProviderDTO from '@modules/appointments/Dtos/IFindAllInMonthProviderDTO';
import IFindAllinDayProviderDTO from '@modules/appointments/Dtos/IFindAllInDayProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllinMonthProviderDTO): Promise<Appointment[]> {
    const appointmentAvailable = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointmentAvailable;
  }

  public async findAllInDayFromProvider({
    provider_id,
    month,
    year,
    day,
  }: IFindAllinDayProviderDTO): Promise<Appointment[]> {
    const appointmentAvailable = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year &&
        getDate(appointment.date) === day,
    );

    return appointmentAvailable;
  }

  public async create(data: IAppointmentsDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(
      appointment,
      {
        id: uuid(),
      },
      data,
    );

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
