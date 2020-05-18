import ITemplateMailDTO from '@shared/container/provider/TemplateMailProvider/Dtos/ITemplateMailDTO';

export default interface IMailProviderDTO {
  from?: {
    name: string;
    address: string;
  };
  to: {
    name: string;
    address: string;
  };
  subject: string;
  template: ITemplateMailDTO;
}
