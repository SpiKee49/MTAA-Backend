import { db } from '../utils/db.server';

type User = {
  id: string;
  username: string;
  profileName: string;
  email: string;
};

export const listAllUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      username: true,
      profileName: true,
      email: true,
      createdAt: true,
    },
  });
};
