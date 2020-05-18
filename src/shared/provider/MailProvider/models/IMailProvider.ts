import IMailProviderDTO from '../Dtos/IMailProviderDTO';

export default interface IMailProvider {
  sendMail(data: IMailProviderDTO): Promise<void>;
}
