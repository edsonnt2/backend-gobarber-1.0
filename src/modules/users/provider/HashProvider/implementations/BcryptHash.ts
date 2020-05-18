import { hash, compare } from 'bcryptjs';
import IHash from '../models/IHash';

class BcryptHash implements IHash {
  public async generateHash(payload: string): Promise<string> {
    const hashedPassword = await hash(payload, 8);

    return hashedPassword;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const passwordMatched = await compare(payload, hashed);

    return passwordMatched;
  }
}

export default BcryptHash;
