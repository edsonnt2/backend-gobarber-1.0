import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.body;
    const { provider_id } = req.params;
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );
    const Availability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return res.json(Availability);
  }
}
