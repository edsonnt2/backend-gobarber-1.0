import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import Auth from '../config/Auth';

interface Token {
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
  if (!authHeader)
    return res.status(400).json({ error: 'JWT token is missing' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, Auth.jwt.secret);
    const { sub: id } = decoded as Token;
    req.user = { id };
    return next();
  } catch {
    return res.status(400).json({ error: 'Invalid JWT token' });
  }
}

export default ensureAuthenticated;
