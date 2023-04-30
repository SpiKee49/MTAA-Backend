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
userRouter.get(
  '/',
  query('search').isString().optional(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Users']
    //#swagger.summary= 'List all Users'
    //#swagger.description= 'Returns a list of all users, optionally filtered by search term'
    /*#swagger.parameters['search']={
      in: 'query',
      required: 'false',
      type: 'string',
      description: 'A search term to filter the list of users'
    }*/

    try {
      const users = await UserService.listAllUsers(
        req.params.search
      );
      /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/UserList" }   
    }*/
      return res.status(200).json(users);
    } catch (err) {
      /*#swagger.responses[500] = { 
    description: 'Internal Server Error'  
    }*/
      return res.status(500).json(err);
    }
  }
);

//GET: all Friends
userRouter.get(
  '/:id/friends',
  param('id').isString(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Users']
    //#swagger.summary= 'Get Users friends'
    //#swagger.description= 'Returns array of Users, that are friends with current user'
    /*#swagger.parameters['id']={
      in: 'path',
      required:'true',
      type: 'string',
      description: 'ID of User whose friends requesting'
    }*/
    try {
      const user = await UserService.getAllFriends(
        req.params.id
      );
      const friends = user?.friends.concat(user.friendedBy);
      /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/UserList" }   
      }*/
      return res.status(200).json(friends);
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//GET: A single User
userRouter.get(
  '/:username',
  param('username').isString(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Users']
    //#swagger.summary= 'User Detail'
    //#swagger.description= 'Returns extended user object'
    /*#swagger.parameters['username'] = {
      in: 'path',
      required:'true',
      type: 'string',
      description: 'username of user account'
    }*/
    const username: string = req.params.username;

    try {
      const user = await UserService.findUserByUsername(
        username
      );
      if (user) {
        /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/UserDetail" }   
      }*/
        return res.status(200).json(user);
      }
      /*#swagger.responses[403] = { 
        description: 'User not found',
        }*/
      return res.status(403).json('User not found');
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//POST: Follwing new album
userRouter.put(
  '/:id',
  param('id').isUUID(),
  body('albumId').isNumeric(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Users']
    //#swagger.summary = 'Follow album'
    //#swagger.description = 'Returns extended user object'
    /*#swagger.parameters['id'] = {
      in: 'path',
      required:'true',
      type: 'string',
      description: 'ID of user'
    }*/
    /*#swagger.parameters['data']={
      in: 'body',
      required:'true',
      schema:{
        $albumId: 111 
      }
    }*/
    const userId: string = req.params.id;

    try {
      const user = await UserService.followAlbum(
        userId,
        Number(req.body.albumId)
      );
      if (user) {
        /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/UserDetail" }   
      }*/
        return res.status(200).json(user);
      }
      /*#swagger.responses[403] = { 
        description: 'User not found',
        }*/
      return res.status(403).json('User not found');
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
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
    //#swagger.tags = ['Users']
    //#swagger.summary= 'Like post'
    //#swagger.description= 'Returns extended user object'
    /*#swagger.parameters['id']={
      in: 'path',
      required:'true',
      type: 'string',
      description: 'ID of user'
    }*/

    /*#swagger.parameters['data']={
      in: 'body',
      required:'true',
      schema:{
        postId: 111
      }
    }*/
    const userId: string = req.params.id;

    try {
      const user = await UserService.likePost(
        userId,
        Number(req.body.postId)
      );
      if (user) {
        /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/UserDetail" }   
        }*/
        return res.status(200).json(user);
      }

      /*#swagger.responses[403] = { 
        description: 'User not found'
        }*/
      return res.status(403).json('User not found');
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//put: Remove Friend
userRouter.put(
  '/friends/remove',
  body('id').isUUID(),
  body('friendId').isUUID(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Users']
    //#swagger.summary= 'Unfriend user'
    //#swagger.description= 'Returns extended user object'
    /*#swagger.parameters['id']={
      in: 'param',
      required:'true',
      type: 'string',
      description: 'ID of user'
    }

    #swagger.parameters['data']={
      in: 'body',
      required:'true',
      schema:{
        friendId: "UUID"
      }
    }*/
    const { id, friendId } = req.body;

    try {
      const friends = await UserService.removeFriend(
        id,
        friendId
      );
      const result = friends.friends.concat(
        friends.friendedBy
      );
      /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/UserList" }   
      }*/
      return res.status(200).json(result);
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//POST: Update User
//Params username,email,password,profileName
userRouter.put(
  '/:id',
  param('id').isString(),
  body('email').isEmail().optional(),
  body('password').isString().optional(),
  body('profileName').isString().optional(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Users']
    //#swagger.summary= 'Update user'
    //#swagger.description= 'Returns extended user object'
    /*#swagger.parameters['id']={
      in: 'path',
      required: 'true',
      type: 'string',
      }*/

    /*#swagger.parameters['data']={
      in: 'body',
      required: 'false',
      schema:{
        email: 'email',
        password: 'new password',
        profileName: 'new profile name'
      }
    }*/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /*#swagger.responses[400] = { 
        description: 'Validation error'  
      }*/
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
      /*#swagger.responses[201] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/UserDetail" }   
      }*/
      return res.status(201).json(updatedUser);
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);
//POST: Delete User
userRouter.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Users']
    //#swagger.summary= 'Delete user'
    //#swagger.description= 'Returns extended user object'
    /*
    #swagger.parameters['id']={
      in: 'param'
      required: 'true',
      type: string,
      }*/
    try {
      await UserService.deleteUser(req.params.id);
      /*#swagger.responses[201] = { 
        description: 'OK',
      }*/
      return res
        .status(201)
        .json('User deleted successfully');
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);
