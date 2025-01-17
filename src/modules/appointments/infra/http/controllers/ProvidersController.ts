import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listProvidersService = container.resolve(ListProvidersService);
    const usersProviders = await listProvidersService.execute({
      user_id: req.user.id,
    });

    return res.json(classToClass(usersProviders));
  }
}
