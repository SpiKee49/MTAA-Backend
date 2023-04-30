import * as AuthServices from './auth.services';
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
    //#swagger.tags = ['Authentication']
    //#swagger.summary = 'Register a new user.'
    //#swagger.description = 'User registration.'
    /*#swagger.parameters['newUser'] = {
      in: 'body',
      description: 'User details for registration.',
      required: true,
      schema: { $ref: '#/definitions/AddNewUser' },
    }*/
    try {
      const { username, profileName, email, password } =
        req.body;

      const existingUser = await findUserByUsername(
        username
      );

      if (existingUser) {
        /*#swagger.responses[400] = {
        description: 'User with the same email already exists.'
        }*/
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
      /*#swagger.responses[200] = {
        schema: {
          refreshToken: { $ref: "#/definitions/Token" },
          hashedToken: { $ref: "#/definitions/Token" }
        },
        description: 'Access token and refresh token for the newly registered user.'
      } */
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
    //#swagger.tags = ['Authentication']
    //#swagger.summary = 'Login to the application'
    //#swagger.description = 'Logs in to an existing user and returns access and refresh tokens.'
    /*#swagger.parameters['username'] ={
        in: 'body',
        description: 'Write there your Username',
        required: 'true',
        schema: { username: 'someUsername' }
    } */
    /*#swagger.parameters['password'] ={
        in: 'body',
        description: 'Write there your Password',
        required: 'true',
        schema: { password: 'somePassword' }
    } */
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        /*#swagger.responses[400] = {
        description: 'Bad request. Username or password missing.'
        } */
        res
          .status(400)
          .json({ message: 'Put in some creds, pls.' });
        throw new Error('Put in some creds, pls.');
      }

      const existingUser = await findUserByUsername(
        username
      );

      if (!existingUser) {
        /*#swagger.responses[403] = {
        description: 'Forbidden. Invalid login credentials. User does not exist.'
        } */
        res.status(403);
        throw new Error('Invalid login creds.');
      }
      if (password !== existingUser.password) {
        /*#swagger.responses[403] = {
        description: 'Forbidden. Invalid login credentials. Password doesnt match User.'
        } */
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
      /*#swagger.responses[200] = {
        schema: {
          refreshToken: { $ref: "#/definitions/Token" },
          hashedToken: { $ref: "#/definitions/Token" }
        },
        description: 'Returns access token and refresh token.'
      } */
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
    //#swagger.tags = ['Authentication']
    //#swagger.summary = 'Refresh user's access token'
    //#swagger.description = 'Get a new access token by sending a valid refresh token'
    /*#swagger.parameter['refreshToken'] ={
      in: 'body',
      description: 'Refresh token to get a new access token',
      required: 'true',
      schema: { $ref: "#/definitions/Token" }
    } */
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        /*#swagger.responses[400] = {
        description: 'Missing refresh token'
        } */
        res.status(400);
        throw new Error('Missing refresh token.');
      }
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as jwt.Secret
      ) as jwt.JwtPayload;

      if (!payload.jti) {
        /*#swagger.responses[403] = {
        description: 'Verification of refresh token failed'
        } */
        res.status(403);
        throw new Error('Refresh Token not verified');
      }
      const savedRefreshToken =
        await AuthServices.findRefreshTokenById(
          payload.jti
        );

      if (
        !savedRefreshToken ||
        savedRefreshToken.revoked === true
      ) {
        /*#swagger.responses[401] = {
        description: 'Unauthorized'
        } */
        res.status(401);
        throw new Error('Unauthorized');
      }

      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        /*#swagger.responses[401] = {
        description: 'Unauthorized'
        } */
        res.status(401);
        throw new Error('Unauthorized');
      }

      const user = await findUser(payload.userId);
      if (!user) {
        /*#swagger.responses[401] = {
        description: 'Unauthorized'
        } */
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
    //#swagger.tags = ['Authentication']
    //#swagger.summary = 'Revoke refresh tokens for a user'
    //#swagger.description = 'Revokes all the refresh tokens of a user by their userId'
    /*#swagger.parameter['userID'] ={
      in: 'body',
      description: 'This API revokes all the refresh tokens of a user by their userId',
      required: 'true',
      schema:{userId:"151213"}
    } */
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
