import 'reflect-metadata';
import 'dotenv/config';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import '@shared/infra/typeorm';
import rateLimiter from './middleware/rateLimiter';

import '@shared/container';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/file', express.static(uploadConfig.uploadFolder));
app.use(routes);

app.use(errors());

app.use((error: Error, req: Request, res: Response, _Next: NextFunction) => {
  if (error instanceof AppError)
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });

  // eslint-disable-next-line
  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => console.log('Node run in port 3333'));
