import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';

export interface CustomRequest extends Request {
  token: string | jwt.JwtPayload;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error('🚫 Un-Authorized 🚫');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as jwt.Secret
    );

    (req as CustomRequest).token = payload;
  } catch (err) {
    res.status(401);
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        throw new Error(err.name);
      }
      throw new Error('🚫 Un-Authorized 🚫');
    } else {
      throw new Error('🚫 Un-Authorized 🚫');
    }
  }

  return next();
}
