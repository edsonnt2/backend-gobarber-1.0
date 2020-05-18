import { Repository, getRepository, Not } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUsersDTO from '@modules/users/Dtos/IUsersDTO';
import IFindProvidersDTO from '@modules/users/Dtos/IFindProvidersDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindProvidersDTO): Promise<User[]> {
    let users;

    if (except_user_id)
      users = this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    else users = this.ormRepository.find();

    return users;
  }

  public async create(data: IUsersDTO): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
