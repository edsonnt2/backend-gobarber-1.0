import User from '../infra/typeorm/entities/User';
import IUsersDTO from '../Dtos/IUsersDTO';
import IFindProvidersDTO from '../Dtos/IFindProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IFindProvidersDTO): Promise<User[]>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(data: IUsersDTO): Promise<User>;
  save(user: User): Promise<User>;
}
