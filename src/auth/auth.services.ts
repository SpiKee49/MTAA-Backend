import bcrypt from 'bcrypt';
import { db } from '../utils/db.server';
import { hashToken } from '../utils/jwt';

type RefreshToken = {
  id: string;
  hashedToken: string;
  revoked: boolean;
};

export const addRefreshTokenToWhitelist = async (
  jti: string,
  refreshToken: string,
  userId: string
): Promise<RefreshToken> => {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

export const findRefreshTokenById = async (
  id: string
): Promise<RefreshToken | null> => {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
};
export const deleteRefreshToken = async (
  id: string
): Promise<RefreshToken | null> => {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = async (userId: string) => {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};
