import { inject, injectable } from 'tsyringe';
import nodeMailer, { Transporter } from 'nodemailer';
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
    nodeMailer.createTestAccount().then(account => {
      const transporter = nodeMailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    template,
  }: IMailProviderDTO): Promise<void> {
    const html = await this.templateMailProvider.parse(template);

    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.address || 'equipe@gobarber.com.br',
      },
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;
