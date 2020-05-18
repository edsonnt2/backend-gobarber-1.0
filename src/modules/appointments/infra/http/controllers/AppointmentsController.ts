import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
/**
 * CRUD
 * index, show, create, update, delete
 */

export default class AppointmentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { provider_id, date } = req.body;

    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );
    const appointment = await createAppointmentService.execute({
      date,
      provider_id,
      user_id: req.user.id,
    });

    return res.json(appointment);
  }
}
