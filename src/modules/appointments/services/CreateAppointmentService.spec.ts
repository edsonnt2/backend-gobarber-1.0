import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let createAppointmentService: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 11, 10).getTime());
  });
  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 11, 11),
      provider_id: '123123',
      user_id: 'user',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create appointment a date that has already passed', async () => {
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 9),
        provider_id: '123123',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment with yourself', async () => {
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 11),
        provider_id: 'user_provider',
        user_id: 'user_provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment before than 8:00 or after 17:00', async () => {
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 12, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 12, 18),
        provider_id: 'provider-id',
        user_id: 'user-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 11, 11);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: 'user',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
