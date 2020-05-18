import fs from 'fs';
import path from 'path';
import UploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(UploadConfig.tmpFolder, file),
      path.resolve(UploadConfig.uploadFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const localFile = path.resolve(UploadConfig.uploadFolder, file);

    try {
      await fs.promises.stat(localFile);
    } catch {
      return;
    }

    await fs.promises.unlink(localFile);
  }
}

export default DiskStorageProvider;
