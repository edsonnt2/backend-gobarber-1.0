import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class SendForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const sendForgotPassword = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPassword.execute({
      email,
    });

    return res.status(204).send();
  }
}
