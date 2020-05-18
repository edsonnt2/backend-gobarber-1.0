import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/provider/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user)
      throw new AppError('Only authenticated users can change avatar.', 401);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const avatar = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = avatar;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
