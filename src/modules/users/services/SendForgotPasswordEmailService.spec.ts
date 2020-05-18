import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/provider/MailProvider/fakes/FakeDiskStorageProvider';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'test@test.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password non-existing user', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'test@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'test@test.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should be able to generate token for identify user', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generateToken');

    const user = await fakeUserRepository.create({
      name: 'Test Name',
      email: 'test@test.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'test@test.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
