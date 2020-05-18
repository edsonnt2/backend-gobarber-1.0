import ITemplateMailDTO from '../Dtos/ITemplateMailDTO';

export default interface ITemplateMailProvider {
  parse(data: ITemplateMailDTO): Promise<string>;
}
