import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UsersController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);
    const user = await updateUserAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });
    return res.json(classToClass(user));
  }
}
