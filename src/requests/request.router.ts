import * as friendRequestServices from './request.services';

import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import express from 'express';
import { isAuthenticated } from '../midlewares';

export const requestRouter = express.Router();

//POST: send FriendRequest
requestRouter.post(
  '/send',
  isAuthenticated,
  body('fromId').isString(),
  body('toId').isString(),
  async (req: Request, res: Response) => {
    try {
      const request =
        await friendRequestServices.sendRequest(
          req.body.fromId,
          req.body.toId
        );
      return res.status(200).json(request);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: handle friend request
requestRouter.post(
  '/handle',
  isAuthenticated,
  body('id').isNumeric(),
  body('status').isBoolean(),
  async (req: Request, res: Response) => {
    try {
      const request =
        await friendRequestServices.handleRequest(
          req.body.id,
          req.body.status
        );
      return res.status(200).json(request);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
