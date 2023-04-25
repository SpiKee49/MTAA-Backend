import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { Secret } from 'jsonwebtoken';
import { User } from '../users/user.services';
import process from 'process';

type CustomUser = Omit<User, 'password'>;

export function generateAccessToken(user: CustomUser) {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: '5m',
    }
  );
}

export function generateRefreshToken(
  user: CustomUser,
  jti: string
) {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    process.env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: '8h',
    }
  );
}

export function generateTokens(
  user: CustomUser,
  jti: string
) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

export function hashToken(token: string) {
  return crypto
    .createHash('sha512')
    .update(token)
    .digest('hex');
}
