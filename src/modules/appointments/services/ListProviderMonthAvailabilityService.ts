import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProvidersService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const amountOfdaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayInMonth = Array.from(
      {
        length: amountOfdaysInMonth,
      },
      (_, index) => index + 1,
    );

    return eachDayInMonth.map(day => {
      const appointmentOfTheDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available: appointmentOfTheDay.length < 10,
      };
    });
  }
}

export default ListProvidersService;
