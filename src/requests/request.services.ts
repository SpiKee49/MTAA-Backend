import { User } from '../users/user.services';
import { db } from '../utils/db.server';

type FriendReq = {
  id: number;
  fromId: string;
  toId: string;
  revoked: boolean | null;
};

export const sendRequest = async (
  fromId: string,
  toId: string
): Promise<FriendReq> => {
  return db.friendRequest.create({
    data: {
      fromId,
      toId,
    },
  });
};

export const getSendFromRequest = async (
  fromId: string
): Promise<FriendReq[]> => {
  return db.friendRequest.findMany({
    where: {
      fromId,
    },
  });
};

export const getSendToRequest = async (
  toId: string
): Promise<FriendReq[]> => {
  return db.friendRequest.findMany({
    where: {
      toId,
      revoked: null,
    },
    include: {
      fromUser: true,
    },
  });
};

export const handleRequest = async (
  id: number,
  status: boolean
): Promise<User | null> => {
  const request = await db.friendRequest.update({
    where: {
      id,
    },
    data: {
      revoked: status,
    },
  });

  if (status === true) {
    return db.user.update({
      where: {
        id: request.toId,
      },
      data: {
        friends: {
          connect: {
            id: request.fromId,
          },
        },
      },
    });
  }

  return null;
};
