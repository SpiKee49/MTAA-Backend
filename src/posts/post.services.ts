import { db } from '../utils/db.server';

type Post = {
  id: number;
  title: string;
  photo: Buffer;
  description: string | null;
  userId: string;
  albumId: number;
  locationId: number;
};

export const listAllPosts = async (): Promise<Post[]> => {
  return db.post.findMany();
};

export const findPost = async (
  id: number
): Promise<Post | null> => {
  return db.post.findUnique({
    where: {
      id,
    },
    include: {
      location: true,
      album: true,
      user: true,
      likedBy: true,
    },
  });
};

export const addPost = async (
  post: Post
): Promise<Post> => {
  return db.post.create({
    data: { ...post },
  });
};

export const updatePost = async (
  post: Post
): Promise<Post> => {
  const { id, ...rest } = post;
  return db.post.update({
    where: {
      id,
    },
    data: { ...rest },
  });
};

export const deletePost = async (
  id: number
): Promise<void> => {
  await db.post.delete({
    where: {
      id,
    },
  });
};
