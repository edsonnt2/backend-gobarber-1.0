import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUsersService from '@modules/users/services/CreateUsersService';
import FakeHashProvider from '@modules/users/provider/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUsersService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await createUsersService.execute({
      name: 'Name Test',
      email: 'test@test.com',
      password: '123456',
    });

    expect(generateHash).toHaveBeenCalledWith('123456');

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@test.com');
  });

  it('should be able to verify that email is already used', async () => {
    await createUsersService.execute({
      name: 'Name Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      createUsersService.execute({
        name: 'Name Test',
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
