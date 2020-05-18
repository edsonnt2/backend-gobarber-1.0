import ICacheProvider from '../models/ICacheProvider';

interface ICache {
  // eslint-disable-next-line
  [key: string]: any;
}

class FakeCacheProvider implements ICacheProvider {
  private caches: ICache = {};

  // eslint-disable-next-line
  public async save(key: string, value: any): Promise<void> {
    this.caches[key] = value;
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.caches[key];

    if (!data) return null;

    const parsedData: T = data;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.caches[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.caches).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => delete this.caches[key]);
  }
}

export default FakeCacheProvider;
