import { User } from '../users/user.services';
import { db } from '../utils/db.server';

type FriendReq = {
  id: number;
  fromId: string;
  toId: string;
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

  if (status) {
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
