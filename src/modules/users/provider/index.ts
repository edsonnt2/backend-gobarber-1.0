import { container } from 'tsyringe';
import IHash from './HashProvider/models/IHash';
import BcryptHash from './HashProvider/implementations/BcryptHash';

container.registerSingleton<IHash>('HashProvider', BcryptHash);
