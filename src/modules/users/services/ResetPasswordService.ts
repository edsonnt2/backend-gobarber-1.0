import { injectable, inject } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHash from '../provider/HashProvider/models/IHash';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHash,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) throw new AppError('Token is invalided');
    const compareDateToken = addHours(userToken.created_at, 2);
    if (isAfter(Date.now(), compareDateToken))
      throw new AppError('Token is expired');

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User not found');

    const passwordhashed = await this.hashProvider.generateHash(password);

    user.password = passwordhashed;

    await this.usersRepository.save(user);

    await this.userTokensRepository.deleteToken(userToken.user_id);
  }
}

export default SendForgotPasswordEmailService;
