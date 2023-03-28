import * as PostServices from './post.services';

import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import express from 'express';

export const postRouter = express.Router();

//GET: all Posts
postRouter.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await PostServices.listAllPosts();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET: Find single Post by it's id
postRouter.get(
  '/:id',
  async (req: Request, res: Response) => {
    const postId: number = parseInt(req.params.id, 10);

    try {
      const post = await PostServices.findPost(postId);
      if (post) {
        return res.status(200).json(post);
      }

      return res.status(404).json('Post not found');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Add Post
//Params title,photo,description,userId,albumId,locationId,
postRouter.post(
  '/',
  body('title').isString(),
  body('photo').isBase64(),
  body('description').isString().optional(),
  body('userId').isString(),
  body('albumId').isNumeric(),
  body('locationId').isNumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const post = req.body;
      const newPost = await PostServices.addPost(post);
      return res.status(201).json(newPost);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Update Post
//Params title,photo,description,userId,albumId,locationId,
postRouter.put(
  '/:id',
  body('title').isString(),
  body('photo').isBase64(),
  body('description').isString().optional(),
  body('userId').isString(),
  body('albumId').isNumeric(),
  body('locationId').isNumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const post = req.body;
      const updatedPost = await PostServices.updatePost(
        post
      );
      return res.status(201).json(updatedPost);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Delete Post
postRouter.delete(
  '/:id',
  async (req: Request, res: Response) => {
    try {
      await PostServices.deletePost(
        parseInt(req.params.id, 10)
      );
      return res
        .status(201)
        .json('Post deleted successfully');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
