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
    include: {
      followedAlbums: true,
      pinnedAlbum: true,
      friends: true,
      likedPosts: true,
    },
  });
};
export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      username,
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
    include: {
      likedPosts: true,
      friends: true,
      followedAlbums: true,
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

export const likePost = async (
  id: string,
  postId: number
): Promise<Omit<User, 'password'>> => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      likedPosts: true,
    },
  });

  const alreadyLiked =
    user?.likedPosts
      .map(item => item.id)
      .includes(postId) ?? false;

  return db.user.update({
    where: {
      id,
    },
    data: {
      likedPosts: {
        ...(!alreadyLiked
          ? {
              connect: {
                id: postId,
              },
            }
          : {
              disconnect: {
                id: postId,
              },
            }),
      },
    },
    include: {
      likedPosts: true,
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
