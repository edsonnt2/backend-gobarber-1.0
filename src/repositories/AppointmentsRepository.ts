import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppoitmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const findAppointmentDate = await this.findOne({
      where: { date },
    });

    return findAppointmentDate || null;
  }
}

export default AppoitmentsRepository;
