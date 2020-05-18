import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  uploadFolder: path.join(tmpFolder, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (req, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const originalName = file.originalname.replace(/ /g, '-');
        const fileName = `${fileHash}-${originalName}`;
        return callback(null, fileName);
      },
    }),
  },
  config: {
    aws: {
      bucket: 'app-gobarber',
    },
  },
} as IUploadConfig;
