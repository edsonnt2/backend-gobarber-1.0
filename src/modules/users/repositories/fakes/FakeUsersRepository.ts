import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUsersDTO from '@modules/users/Dtos/IUsersDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IFindProvidersDTO from '@modules/users/Dtos/IFindProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id)
      users = this.users.filter(user => user.id !== except_user_id);

    return users;
  }

  public async create(data: IUsersDTO): Promise<User> {
    const user = new User();
    const id = uuid();

    Object.assign(user, { id }, data);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(({ id }) => id === user.id);
    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
