import * as AuthServices from './auth.services';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import {
  addUser,
  findUser,
  findUserByUsername,
} from '../users/user.services';
import { generateTokens, hashToken } from '../utils/jwt';

import { body } from 'express-validator';
import express from 'express';
import { v4 } from 'uuid';

export const authRouter = express.Router();

//Post: Register
//args: username,profileName,email,password

authRouter.post(
  '/register',
  body('username').isString(),
  body('profileName').isString(),
  body('email').isEmail(),
  body('password').isString(),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username, profileName, email, password } =
        req.body;

      const existingUser = await findUserByUsername(
        username
      );

      if (existingUser) {
        res.status(400);
        throw new Error(
          'User with same e-mail already exists my guy'
        );
      }

      const user = await addUser({
        username,
        profileName,
        email,
        password,
      });

      const jti = v4();
      const { accessToken, refreshToken } = generateTokens(
        user,
        jti
      );
      await AuthServices.addRefreshTokenToWhitelist(
        jti,
        refreshToken,
        user.id
      );

      return res
        .status(200)
        .json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }
);

//Post: login
//args: username,passoword
authRouter.post(
  '/login',
  body('username').isString(),
  body('password').isString(),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400);
        throw new Error('Put in some creds, pls.');
      }

      const existingUser = await findUserByUsername(
        username
      );

      if (!existingUser) {
        res.status(403);
        throw new Error('Invalid login creds.');
      }
      if (password !== existingUser.password) {
        res.status(403);
        throw new Error('Invalid login creds.');
      }

      const jti = v4();
      const { accessToken, refreshToken } = generateTokens(
        existingUser,
        jti
      );
      await AuthServices.addRefreshTokenToWhitelist(
        jti,
        refreshToken,
        existingUser.id
      );

      return res
        .status(200)
        .json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  '/refreshToken',
  body('refreshToken').isString(),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400);
        throw new Error('Missing refresh token.');
      }
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as jwt.Secret
      ) as jwt.JwtPayload;

      if (!payload.jti) {
        res.status(403);
        throw new Error('Refresh Token not veryfied');
      }
      const savedRefreshToken =
        await AuthServices.findRefreshTokenById(
          payload.jti
        );

      if (
        !savedRefreshToken ||
        savedRefreshToken.revoked === true
      ) {
        res.status(401);
        throw new Error('Unauthorized');
      }

      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        res.status(401);
        throw new Error('Unauthorized');
      }

      const user = await findUser(payload.userId);
      if (!user) {
        res.status(401);
        throw new Error('Unauthorized');
      }

      await AuthServices.deleteRefreshToken(
        savedRefreshToken.id
      );
      const jti = v4();
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user, jti);
      await AuthServices.addRefreshTokenToWhitelist(
        jti,
        newRefreshToken,
        user.id
      );

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  '/revokeRefreshTokens',
  async (req, res, next) => {
    try {
      const { userId } = req.body;
      await AuthServices.revokeTokens(userId);
      res.json({
        message: `Tokens revoked for user with id #${userId}`,
      });
    } catch (err) {
      next(err);
    }
  }
);
