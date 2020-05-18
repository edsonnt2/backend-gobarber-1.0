import 'reflect-metadata';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeHashProvider from '@modules/users/provider/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'test@test.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate without existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to return email error', async () => {
    await fakeUsersRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'no-mail@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to return password error', async () => {
    await fakeUsersRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'test@test.com',
        password: 'no-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
