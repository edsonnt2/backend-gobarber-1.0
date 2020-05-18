import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHash from '@modules/users/provider/HashProvider/models/IHash';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHash,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    new_password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    const verifyEmail = await this.userRepository.findByEmail(email);

    if (verifyEmail && verifyEmail.id !== user.id)
      throw new AppError('Email is already registered');

    if (new_password && !old_password)
      throw new AppError('Old password needs to be informed');

    if (new_password && old_password && old_password !== new_password) {
      const comparePassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!comparePassword) throw new AppError('Old password is incorrect');

      user.password = await this.hashProvider.generateHash(new_password);
    }

    user.name = name;
    user.email = email;

    const newUser = await this.userRepository.save(user);

    return newUser;
  }
}

export default UpdateProfileService;
