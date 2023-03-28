import { db } from '../utils/db.server';

type User = {
  id: string;
  username: string;
  profileName: string;
  email: string;
  password: string;
};

export const listAllUsers = async (): Promise<
  Omit<User, 'password'>[]
> => {
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
  });
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

export const deleteUser = async (
  id: string
): Promise<void> => {
  await db.user.delete({
    where: {
      id,
    },
  });
};
