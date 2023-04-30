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
    //#swagger.tags = ['Tokens']
    //#swagger.summary = 'Get all tokens'
    //#swagger.description = 'Returns a list of all tokens'
    try {
      const request = await TokenServices.getAllTokens();
      /*#swagger.responses[200] = { 
      description: 'OK',
      schema: { $ref: "#/definitions/Token" }   
      }*/
      return res.status(200).json(request);
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//POST: add token
tokenRouter.post(
  '/add',
  body('token').isString(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Tokens']
    //#swagger.summary = 'Add a new token'
    //#swagger.description = 'Add a new token'
    /*#swagger.parameters['token'] ={
      in: 'body',
      description:'Token that is being added',
      required: true,
      schema: { $ref: "#/definitions/AddToken" }
    }*/
    try {
      const existingToken = await TokenServices.getToken(
        req.body.token
      );
      if (!existingToken) {
        const newToken = await TokenServices.addToken(
          req.body.token
        );
        /*  #swagger.responses[201] = { 
        schema: { $ref: "#/definitions/Token" },   
        description: 'Token created and added'
        } */
        return res.status(200).json(newToken);
      }
      /*  #swagger.responses[201] = { 
      schema: { $ref: "#/definitions/Token" },   
      description: 'Token added'
      } */
      return res.status(200).json(existingToken);
    } catch (err) {
      /* #swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
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
    //#swagger.tags = ['Tokens']
    //#swagger.summary = 'Delete an existing token.'
    //#swagger.description = 'Delete an existing token.'
    /*#swagger.parameters['token'] = { 
      in: 'body', 
      description: 'Token to delete', 
      required: true, 
      schema:{ $ref: "#/definitions/DeleteToken" } 
    } */
    try {
      const request = await TokenServices.removeToken(
        req.body.token
      );
      /*#swagger.responses[200] = { 
      description: 'Token deleted', 
      schema: { type: 'string' } 
      */
      return res.status(200).json(request);
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
      return res.status(500).json(err);
    }
  }
);
