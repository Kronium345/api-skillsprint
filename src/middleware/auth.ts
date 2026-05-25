import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { fail } from '../utils/apiResponse';
import { User, type IUser } from '../models/User';

export type AuthRequest = Request & { user?: IUser };

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return fail(res, 'Unauthorized', 401);
  }

  const token = header.slice(7);
  const secret = process.env.KEY;
  if (!secret) {
    return fail(res, 'Server misconfigured', 500);
  }

  try {
    const payload = jwt.verify(token, secret) as { userId: string };
    User.findById(payload.userId)
      .then((user) => {
        if (!user) return fail(res, 'User not found', 401);
        req.user = user;
        next();
      })
      .catch(() => fail(res, 'Unauthorized', 401));
  } catch {
    return fail(res, 'Invalid token', 401);
  }
}

export function signToken(userId: string): string {
  const secret = process.env.KEY;
  if (!secret) throw new Error('KEY is not set');
  return jwt.sign({ userId }, secret, { expiresIn: '30d' });
}
