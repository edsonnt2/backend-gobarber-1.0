import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeHashProvider from '@modules/users/provider/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHaFakeHashProvider: FakeHashProvider;
let UpdateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHaFakeHashProvider = new FakeHashProvider();

    UpdateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHaFakeHashProvider,
    );
  });

  it('should be able to update user', async () => {
    const generateHash = jest.spyOn(fakeHaFakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    const updateProfile = await UpdateProfile.execute({
      user_id: user.id,
      name: 'Update Test',
      email: 'update@test.com',
      old_password: '123456',
      new_password: '123123',
    });

    expect(updateProfile.name).toBe('Update Test');
    expect(updateProfile.email).toBe('update@test.com');
    expect(updateProfile.password).toBe('123123');
    expect(generateHash).toHaveBeenCalledWith('123123');
  });

  it('should be able to update user whiout update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    const updateProfile = await UpdateProfile.execute({
      user_id: user.id,
      name: 'Update Test',
      email: 'update@test.com',
    });

    expect(updateProfile.name).toBe('Update Test');
    expect(updateProfile.email).toBe('update@test.com');
    expect(updateProfile.password).toBe('123456');
  });

  it('should not be able to update with non-existing user', async () => {
    await expect(
      UpdateProfile.execute({
        user_id: 'non-existing-user',
        name: 'Update Test',
        email: 'update@test.com',
        old_password: '123456',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user with email already registered for another user', async () => {
    await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'update@test.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      UpdateProfile.execute({
        user_id: user.id,
        name: 'Update Test',
        email: 'update@test.com',
        old_password: '123456',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      UpdateProfile.execute({
        user_id: user.id,
        name: 'Update Test',
        email: 'update@test.com',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user with old password incorrect', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      UpdateProfile.execute({
        user_id: user.id,
        name: 'Update Test',
        email: 'update@test.com',
        old_password: 'old-password-incorrect',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
