import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';
import RedisProvider from './implementations/RedisProvider';

container.registerSingleton<ICacheProvider>('CacheProvider', RedisProvider);
