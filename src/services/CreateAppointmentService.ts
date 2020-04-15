import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppoitmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppoitmentsRepository);
    const StartedDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      StartedDate,
    );

    if (findAppointmentInSameDate)
      throw new Error('This appointments is already booked');

    const appointment = appointmentsRepository.create({
      provider_id,
      date: StartedDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
