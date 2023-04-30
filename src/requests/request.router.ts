import * as friendRequestServices from './request.services';

import { Request, Response } from 'express';
import {
  body,
  param,
  validationResult,
} from 'express-validator';

import express from 'express';
import { isAuthenticated } from '../midlewares';

export const requestRouter = express.Router();

//GET: all send requests by user
requestRouter.get(
  '/:type/:id',
  isAuthenticated,
  param('id').isUUID(),
  param('type').isString(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['FriendRequests']
    //#swagger.summary = 'Get all sent friend requests by user'
    //#swagger.description = 'Retrieves all friend requests sent by a user to other users.'
    /*#swagger.parameters['id']={
      in: 'path',
      description: 'The type of request (from or to)',
      required: true,
      type: 'string'
    } */
    /*#swagger.parameters['type']={
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string',
      format: 'uuid'
    } */
    try {
      const request =
        req.params.type === 'from'
          ? await friendRequestServices.getSendFromRequest(
              req.params.id
            )
          : await friendRequestServices.getSendToRequest(
              req.params.id
            );
      /*#swagger.responses[200] = {
      description: 'Friend requests retrieved',
      schema: {$ref: '#/definitions/FriendRequest'}
      }*/
      return res.status(200).json(request);
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
      return res.status(500).json(err);
    }
  }
);

//POST: send FriendRequest
requestRouter.post(
  '/send',
  isAuthenticated,
  body('fromId').isString(),
  body('toId').isString(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['FriendRequests']
    //#swagger.summary = 'Send a friend request.'
    //#swagger.description = 'Send a friend request to another user.'
    /*#swagger.parameters['fromId'] = {
      in: 'body',
      description: 'The ID of the user sending the FriendRequest.',
      required: true,
      type: 'string'
    }*/
    /*#swagger.parameters['toId'] = {
      in: 'body',
      description: 'The ID of the user receiving the FriendRequest.',
      required: true,
      type: 'string'
    }*/
    try {
      const request =
        await friendRequestServices.sendRequest(
          req.body.fromId,
          req.body.toId
        );
        /*  #swagger.responses[201] = { 
        schema: { $ref: "#/definitions/FriendRequest" },   
        description: 'FriendRequest was sent'
        } */
      return res.status(200).json(request);
    } catch (err) {
      /* #swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
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
    //#swagger.tags = ['FriendRequests']
    //#swagger.summary = 'Handle a friend request'
    //#swagger.description = 'Handle a friend request by approving or rejecting it.'
    /*#swagger.parameters['id'] = { 
      in: 'body', 
      description: 'The ID of the friend request to handle.', 
      required: true, 
      type: 'integer' 
      }*/
    /*#swagger.parameters['status'] = { 
      in: 'body', 
      description: 'The status to set for the friend request(status will appear in the revoked parameter of FriendRequest)', 
      required: true, 
      type: 'boolean' 
      }*/
    try {
      const request =
        await friendRequestServices.handleRequest(
          req.body.id,
          req.body.status
        );
      /*#swagger.responses[200] = { 
      description: 'FriendRequest was handled',
      schema: { $ref: "#/definitions/FriendRequest" }   
      }*/
      return res.status(200).json(request);
    } catch (err) {
      /* #swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
      return res.status(500).json(err);
    }
  }
);
