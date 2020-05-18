import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;

let ShowProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    ShowProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to list profile user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    const showUser = await ShowProfile.execute({
      user_id: user.id,
    });

    expect(showUser).toHaveProperty('id');
    expect(showUser.name).toBe('Test Name');
  });

  it('should not be able to list profile with no-existing user', async () => {
    await expect(
      ShowProfile.execute({
        user_id: 'no-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
