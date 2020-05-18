import 'reflect-metadata';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeDiskStorageProvider from '@shared/provider/StorageProvider/fakes/FakeDiskStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeDiskStorageProvider: FakeDiskStorageProvider;
let UpdateUserAvatar: UpdateUserAvatarService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDiskStorageProvider = new FakeDiskStorageProvider();

    UpdateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeDiskStorageProvider,
    );
  });
  it('should be able to create a new avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    const avatar = await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(avatar.avatar).toBe('avatar.jpg');
  });

  it('should not be able to create a new avatar for non existing user', async () => {
    await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      UpdateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar then update a new avatar', async () => {
    const deleteAvatar = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    const avatar = await UpdateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteAvatar).toHaveBeenCalledWith('avatar.jpg');
    expect(avatar.avatar).toBe('avatar2.jpg');
  });
});
