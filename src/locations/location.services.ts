import { db } from '../utils/db.server';

type Location = {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
};

export const listAllLocations = async (
  search?: string
): Promise<Location[]> => {
  return db.location.findMany({
    where: {
      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
    },
  });
};

export const findLocation = async (
  id: number
): Promise<Location | null> => {
  return db.location.findUnique({
    where: {
      id,
    },
    include: {
      posts: true,
    },
  });
};

export const addLocation = async (
  location: Location
): Promise<Location> => {
  return db.location.create({
    data: { ...location },
  });
};

export const updateLocation = async (
  location: Location
): Promise<Location> => {
  const { id, ...rest } = location;
  return db.location.update({
    where: {
      id,
    },
    data: {
      ...rest,
    },
  });
};

export const deleteLocation = async (
  id: number
): Promise<void> => {
  await db.location.delete({
    where: {
      id,
    },
  });
};
