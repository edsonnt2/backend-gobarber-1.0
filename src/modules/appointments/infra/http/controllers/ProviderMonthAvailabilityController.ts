import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { month, year } = req.body;
    const { provider_id } = req.params;
    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService,
    );
    const Availability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month,
      year,
    });

    return res.json(Availability);
  }
}
