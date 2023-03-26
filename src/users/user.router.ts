import * as UserService from './user.services';

import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import express from 'express';

export const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const users = await UserService.listAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});
