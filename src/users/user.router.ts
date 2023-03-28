import * as UserService from './user.services';

import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import express from 'express';

export const userRouter = express.Router();

//GET: all Users
userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const users = await UserService.listAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET: A single User
userRouter.get(
  '/:id',
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
