import * as UserService from './user.services';

import { Request, Response } from 'express';
import {
  body,
  param,
  query,
  validationResult,
} from 'express-validator';

import express from 'express';
import { isAuthenticated } from '../midlewares';

export const userRouter = express.Router();

//GET: all Users
//#swagger.tags = ['Users']
userRouter.get(
  '/',
  query('search').isString(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const users = await UserService.listAllUsers(
        req.params.search
      );
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//GET: A single User
//#swagger.tags = ['Users']
userRouter.get(
  '/:username',
  param('username').isString(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const username: string = req.params.username;

    try {
      const user = await UserService.findUserByUsername(
        username
      );
      if (user) {
        return res.status(200).json(user);
      }

      return res.status(404).json('User not found');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Follwing new album
//#swagger.tags = ['Users']
userRouter.put(
  '/:id',
  param('id').isUUID(),
  body('albumId').isNumeric(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    try {
      const user = await UserService.followAlbum(
        userId,
        Number(req.body.albumId)
      );
      if (user) {
        return res.status(200).json(user);
      }

      return res.status(404).json('User not found');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//put: Like post
//#swagger.tags = ['Users']
userRouter.put(
  '/:id/like',
  param('id').isUUID(),
  body('postId').isNumeric(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    try {
      const user = await UserService.likePost(
        userId,
        Number(req.body.postId)
      );
      if (user) {
        return res.status(200).json(user);
      }

      return res.status(403).json('User not found');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Update User
//Params username,email,password,profileName
//#swagger.tags = ['Users']
userRouter.put(
  '/:id',
  body('username').isString().optional(),
  body('email').isEmail().optional(),
  body('password').isString().optional(),
  body('profileName').isString().optional(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const user = req.body;
      const updatedUser = await UserService.updateUser(
        user,
        req.params.id
      );
      return res.status(201).json(updatedUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
//POST: Delete User
//#swagger.tags = ['Users']
userRouter.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      await UserService.deleteUser(req.params.id);
      return res
        .status(201)
        .json('User deleted successfully');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
