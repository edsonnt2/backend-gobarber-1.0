import { inject, injectable } from 'tsyringe';
import nodeMailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/Mail';
import ITemplateMailProvider from '@shared/provider/TemplateMailProvider/models/ITemplateMailProvider';
import IMailProvider from '../models/IMailProvider';
import IMailProviderDTO from '../Dtos/IMailProviderDTO';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('TemplateMailProvider')
    private templateMailProvider: ITemplateMailProvider,
  ) {
    this.client = nodeMailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-west-2',
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    template,
  }: IMailProviderDTO): Promise<void> {
    const html = await this.templateMailProvider.parse(template);
    const { name, adress } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.address || adress,
      },
      to,
      subject,
      html,
    });
  }
}

export default EtherealMailProvider;
