import * as UserService from './user.services';

import { Request, Response } from 'express';
import {
  body,
  param,
  query,
  validationResult,
} from 'express-validator';

import express from 'express';

export const userRouter = express.Router();

//GET: all Users
userRouter.get(
  '/',
  query('search').isString(),
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
userRouter.get(
  '/:id',
  param('id').isUUID(),
  async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    try {
      const user = await UserService.findUser(userId);
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
userRouter.put(
  '/:id',
  param('id').isUUID(),
  body('albumId').isNumeric(),
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

//POST: Login
userRouter.post(
  '/login',
  body('username').isString(),
  body('password').isString(),
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const user = await UserService.loginUser(
        username,
        password
      );
      if (user) {
        const { password, ...rest } = user;
        return res.status(200).json(rest);
      }

      return res
        .status(404)
        .json("Email or password don't match");
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Add User
//Params username,email,password,profileName
userRouter.post(
  '/',
  body('username').isString(),
  body('email').isEmail(),
  body('password').isString(),
  body('profileName').isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const user = req.body;
      const newAuthor = await UserService.addUser(user);
      return res.status(201).json(newAuthor);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
//POST: Update User
//Params username,email,password,profileName
userRouter.put(
  '/:id',
  body('username').isString(),
  body('email').isEmail(),
  body('password').isString(),
  body('profileName').isString(),
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

userRouter.delete(
  '/:id',
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
