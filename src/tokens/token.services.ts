import { db } from '../utils/db.server';

type ExpoPushToken = {
  token: string;
};

export const getToken = async (
  token: string
): Promise<ExpoPushToken | null> => {
  return db.pushToken.findUnique({ where: { token } });
};

export const getAllTokens = async (): Promise<
  ExpoPushToken[]
> => {
  return db.pushToken.findMany();
};

export const addToken = async (
  token: string
): Promise<ExpoPushToken> => {
  return db.pushToken.create({
    data: {
      token,
    },
  });
};

export const removeToken = async (
  token: string
): Promise<void> => {
  await db.pushToken.delete({
    where: {
      token,
    },
  });
};
