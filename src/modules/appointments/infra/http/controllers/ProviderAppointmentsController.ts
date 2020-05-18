import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListAppointmentsProviderService from '@modules/appointments/services/ListAppointmentsProviderService';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.body;
    const listAppointmentsProviderService = container.resolve(
      ListAppointmentsProviderService,
    );
    const Appointments = await listAppointmentsProviderService.execute({
      provider_id: req.user.id,
      day,
      month,
      year,
    });

    return res.json(Appointments);
  }
}
