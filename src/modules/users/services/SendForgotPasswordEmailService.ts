import path from 'path';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/provider/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('User does not existing');

    const { token } = await this.userTokensRepository.generateToken(user.id);

    const body = path.resolve(
      __dirname,
      '..',
      'templates',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        address: email,
      },
      subject: '[GoBarbar] Recuperação de senha',
      template: {
        body,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
