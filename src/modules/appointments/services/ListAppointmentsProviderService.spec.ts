import 'reflect-metadata';
import FakeCacheProvider from '@shared/provider/CacheProvider/fakes/FakeCacheProvider';
import ListAppointmentsProviderService from './ListAppointmentsProviderService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listAppointmentsProviderService: ListAppointmentsProviderService;

describe('ListAppointmentsProvider', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listAppointmentsProviderService = new ListAppointmentsProviderService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the provider appointments', async () => {
    const appointmentOne = await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2020, 4, 13, 8),
    });

    const appointmentTwo = await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2020, 4, 13, 9),
    });

    const appointments = await listAppointmentsProviderService.execute({
      provider_id: 'provider-id',
      day: 13,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointmentOne, appointmentTwo]);
  });

  it("should be able to list the provider's appointments that are cached", async () => {
    const appointmentOne = await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2020, 4, 13, 8),
    });

    const appointmentTwo = await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2020, 4, 13, 9),
    });

    const appointments = await listAppointmentsProviderService.execute({
      provider_id: 'provider-id',
      day: 13,
      month: 5,
      year: 2020,
    });

    const appointmentsCache = await listAppointmentsProviderService.execute({
      provider_id: 'provider-id',
      day: 13,
      month: 5,
      year: 2020,
    });

    expect(appointmentsCache).toEqual(appointments);
    expect(appointmentsCache).toEqual([appointmentOne, appointmentTwo]);
  });
});
