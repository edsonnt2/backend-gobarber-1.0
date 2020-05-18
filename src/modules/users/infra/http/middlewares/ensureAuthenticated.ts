import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import Auth from '@config/Auth';
import AppError from '@shared/errors/AppError';

interface IToken {
  iat: number;
  exp: number;
  sub: string;
}

function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError('JWT token is missing', 401);

  const [, token] = authHeader.split(' ');

  const { secret } = Auth.jwt;

  try {
    const decoded = verify(token, secret);
    const { sub: id } = decoded as IToken;
    req.user = { id };
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}

export default ensureAuthenticated;
