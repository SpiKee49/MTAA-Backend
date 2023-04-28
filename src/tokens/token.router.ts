import * as TokenServices from './token.services';

import { Request, Response } from 'express';

import { body } from 'express-validator';
import express from 'express';
import { isAuthenticated } from '../midlewares';

export const tokenRouter = express.Router();

//GET: all tokens
tokenRouter.get(
  '/',
  isAuthenticated,
  body('token').isString(),
  async (_: Request, res: Response) => {
    try {
      const request = await TokenServices.getAllTokens();
      return res.status(200).json(request);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: add token
tokenRouter.post(
  '/add',
  body('token').isString(),
  async (req: Request, res: Response) => {
    try {
      const existingToken = await TokenServices.getToken(
        req.body.token
      );
      if (!existingToken) {
        const newToken = await TokenServices.addToken(
          req.body.token
        );
        return res.status(200).json(newToken);
      }
      return res.status(200).json(existingToken);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//DELTE: remove token
tokenRouter.delete(
  '/delete',
  isAuthenticated,
  body('token').isString(),
  async (req: Request, res: Response) => {
    try {
      const request = await TokenServices.removeToken(
        req.body.token
      );
      return res.status(200).json(request);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
