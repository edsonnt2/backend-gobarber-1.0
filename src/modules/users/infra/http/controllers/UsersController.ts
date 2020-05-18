import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUsersService from '@modules/users/services/CreateUsersService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const createUser = container.resolve(CreateUsersService);

    const user = await createUser.execute({
      email,
      name,
      password,
    });

    return res.json(classToClass(user));
  }
}
