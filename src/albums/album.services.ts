import { db } from '../utils/db.server';

export type Album = {
  id: number;
  title: string;
  description: string | null;
  ownerId: string;
  tags?: string[];
};

export const listAllAlbums = async (
  search?: string
): Promise<Album[]> => {
  return db.album.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      ownerId: true,
      tags: true,
    },
  });
};

export const findAlbum = async (
  id: number
): Promise<Album | null> => {
  return db.album.findUnique({
    where: {
      id,
    },
    include: {
      followingUsers: true,
      posts: true,
    },
  });
};

export const searchAlbum = async (
  value: string
): Promise<Album[] | null> => {
  return db.album.findMany({
    where: {
      title: {
        contains: value,
      },
      OR: {
        description: {
          contains: value,
        },
      },
    },
  });
};

export const addAlbum = async (
  album: Omit<Album, 'id'>
): Promise<Album> => {
  const { title, description, tags, ownerId } = album;
  return db.album.create({
    include: {
      owner: true,
    },
    data: {
      title,
      description,
      tags,
      ownerId,
    },
  });
};

export const updateAlbum = async (
  album: Omit<Album, 'ownerId'>
): Promise<Album> => {
  const { title, description, tags, id } = album;
  return db.album.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      tags,
    },
  });
};

export const deleteAlbum = async (
  id: number
): Promise<void> => {
  await db.album.delete({
    where: {
      id,
    },
  });
};
