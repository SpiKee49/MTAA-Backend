import { db } from '../utils/db.server';

type Location = {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
};

export const listAllLocations = async (): Promise<
  Location[]
> => {
  return db.location.findMany();
};

export const findLocation = async (
  id: number
): Promise<Location | null> => {
  return db.location.findUnique({
    where: {
      id,
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
