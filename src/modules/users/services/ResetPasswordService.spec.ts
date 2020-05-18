import 'reflect-metadata';
import FakeHashProvider from '@modules/users/provider/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let resetPasswordService: ResetPasswordService;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const save = jest.spyOn(fakeUsersRepository, 'save');

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generateToken(user.id);

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    const resetUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');

    expect(resetUser?.password).toBe('123123');
    expect(save).toHaveBeenCalledWith(resetUser);
  });

  it('should not be able to reset password with invalid token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '123123',
        token: 'non-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generateToken(
      'non-existing-user',
    );

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generateToken(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const newDate = new Date();

      return newDate.setHours(newDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove tokens after reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generateToken(user.id);

    await fakeUserTokensRepository.generateToken(user.id);

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    await expect(
      resetPasswordService.execute({
        password: '123456',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
