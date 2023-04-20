import { addAlbum } from '../albums/album.services';
import { db } from '../utils/db.server';

export type User = {
  id: string;
  username: string;
  profileName: string;
  email: string;
  password: string;
};

export const listAllUsers = async (
  search?: string
): Promise<Omit<User, 'password'>[]> => {
  return db.user.findMany({
    where: {
      ...(search
        ? {
            OR: {
              profileName: {
                contains: search,
              },
              username: {
                contains: search,
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      username: true,
      profileName: true,
      email: true,
      createdAt: true,
    },
  });
};

export const findUser = async (
  id: string
): Promise<Omit<User, 'password'> | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      profileName: true,
      email: true,
    },
    include: {
      followedAlbums: true,
      pinnedAlbum: true,
      friends: true,
    },
  });
};

export const loginUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      profileName: true,
      email: true,
      password: true,
    },
  });

  if (user == null || user.password !== password) {
    return null;
  }

  return user;
};

export const addUser = async (
  user: Omit<User, 'id'>
): Promise<Omit<User, 'password'>> => {
  const { username, profileName, email, password } = user;
  return db.user.create({
    data: {
      username,
      profileName,
      email,
      password,
    },
    select: {
      id: true,
      username: true,
      profileName: true,
      email: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, 'id'>,
  id: string
): Promise<Omit<User, 'password'>> => {
  const { username, profileName, email, password } = user;
  return db.user.update({
    where: {
      id,
    },
    data: {
      username,
      profileName,
      email,
      password,
    },
    select: {
      id: true,
      username: true,
      profileName: true,
      email: true,
    },
  });
};

export const followAlbum = async (
  id: string,
  albumId: number
): Promise<Omit<User, 'password'>> => {
  return db.user.update({
    where: {
      id,
    },
    data: {
      followedAlbums: {
        connect: {
          id: albumId,
        },
      },
    },
    include: {
      followedAlbums: true,
    },
  });
};

export const deleteUser = async (
  id: string
): Promise<void> => {
  await db.user.delete({
    where: {
      id,
    },
  });
};
