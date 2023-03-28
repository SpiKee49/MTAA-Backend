import { db } from '../utils/db.server';

type Album = {
  id: number;
  title: string;
  description: string | null;
  ownerId: string;
  tags?: string[];
};

export const listAllAlbums = async (): Promise<Album[]> => {
  return db.album.findMany({
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
  });
};

export const addAlbum = async (
  album: Album
): Promise<Album> => {
  const { title, description, tags, ownerId } = album;
  return db.album.create({
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
