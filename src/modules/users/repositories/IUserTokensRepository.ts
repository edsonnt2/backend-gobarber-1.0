import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  generateToken(id_user: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  deleteToken(id_user: string): Promise<void>;
}
