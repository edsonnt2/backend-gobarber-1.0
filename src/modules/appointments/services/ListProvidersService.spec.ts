import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/provider/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'Test One',
      email: 'testone@test.com',
      password: '123456',
    });

    const userTwo = await fakeUsersRepository.create({
      name: 'Test Two',
      email: 'testtwo@test.com',
      password: '123456',
    });

    const userLogged = await fakeUsersRepository.create({
      name: 'Test Three',
      email: 'testthree@test.com',
      password: '123456',
    });

    const listProvider = await listProvidersService.execute({
      user_id: userLogged.id,
    });

    expect(listProvider).toEqual([userOne, userTwo]);
  });

  it('should be able to bring list cache after cache loaded', async () => {
    await fakeUsersRepository.create({
      name: 'Test One',
      email: 'testone@test.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Test Two',
      email: 'testtwo@test.com',
      password: '123456',
    });

    const userLogged = await fakeUsersRepository.create({
      name: 'Test Three',
      email: 'testthree@test.com',
      password: '123456',
    });

    const listOne = await listProvidersService.execute({
      user_id: userLogged.id,
    });

    const listCache = await listProvidersService.execute({
      user_id: userLogged.id,
    });

    expect(listCache).toEqual(listOne);
  });
});
