import IMailProvider from '../models/IMailProvider';

class FakeMailProvider implements IMailProvider {
  private emails: string[] = [];

  public async sendMail(): Promise<void> {
    this.emails.push('sent email');
  }
}

export default FakeMailProvider;
