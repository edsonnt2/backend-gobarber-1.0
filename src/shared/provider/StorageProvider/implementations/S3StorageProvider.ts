import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

import fs from 'fs';
import path from 'path';
import UploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalFile = path.resolve(UploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalFile);

    if (!ContentType) throw new Error('file not found');

    const fileContent = await fs.promises.readFile(originalFile);

    await this.client
      .putObject({
        Bucket: UploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalFile);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: UploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
