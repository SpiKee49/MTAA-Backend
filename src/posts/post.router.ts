import * as PostServices from './post.services';

import { Request, Response } from 'express';
import {
  body,
  param,
  validationResult,
} from 'express-validator';

import express from 'express';
import { getAllTokens } from '../tokens/token.services';
import { isAuthenticated } from '../midlewares';
import { sendPushNotifications } from '..';

export const postRouter = express.Router();

//GET: all Posts
postRouter.get('/', async (req: Request, res: Response) => {
  //#swagger.tags = ['Posts']
  //#swagger.summary= 'List all Posts'
  //#swagger.description= 'Returns a list of all posts, optionally filtered by search term'
  /*#swagger.parameters['search']={
      in: 'query',
      required: 'false',
      type: 'string',
      description: 'A search term to filter the list of posts'
    }*/
  try {
    const posts = await PostServices.listAllPosts();
    /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/PostList" }   
    }*/
    return res.status(200).json(posts);
  } catch (err) {
    /*#swagger.responses[500] = { 
    description: 'Internal Server Error'  
    }*/
    return res.status(500).json(err);
  }
});
//GET: Number of likes on post
postRouter.get(
  '/:id/likes',
  param('id').isNumeric(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Posts']
    //#swagger.summary= 'Get number of likes on post'
    //#swagger.description= 'returns number of likes on post based on id'
    /*#swagger.parameters['id']={
      in: 'path',
      required:'true',
      type: 'number',
    }*/
    try {
      const likes = await PostServices.postLikeNumber(
        parseInt(req.params.id, 10)
      );
      /*#swagger.responses[200] = { 
        description: 'OK',
        type: 'number'  
      }*/
      return res.status(200).json(likes);
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//GET: Find single Post by it's id
postRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Posts']
    //#swagger.summary= 'Post Detail'
    //#swagger.description= 'Returns extended post object'
    /*#swagger.parameters['id'] = {
      in: 'path',
      required:'true',
      type: 'number',
    }*/
    const postId: number = parseInt(req.params.id, 10);

    try {
      const post = await PostServices.findPost(postId);
      if (post) {
        /*#swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/PostDetail" }   
      }*/
        return res.status(200).json(post);
      }
      /*#swagger.responses[403] = { 
        description: 'Post not found',
        schema: { $ref: "#/definitions/UserDetail" }   
      }*/
      return res.status(403).json('Post not found');
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//POST: Add Post
//Params title,photo,description,userId,albumId,locationId,
postRouter.post(
  '/',
  isAuthenticated,
  body('title').isString(),
  body('photo').isBase64(),
  body('description').isString().optional(),
  body('userId').isString(),
  body('albumId').isNumeric(),
  body('locationId').isNumeric(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Posts']
    //#swagger.summary= 'Add post'
    //#swagger.description= 'Returning post object'
    /*#swagger.parameters['data'] = {
      in: 'body',
      required:'true',
      schema:{$ref:'#/definitions/AddPost'},
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
      const { photo, ...post } = req.body;
      const newPost = await PostServices.addPost({
        ...post,
        photo: Buffer.from(photo, 'base64'),
      });
      const tokens = await getAllTokens();
      if (newPost !== undefined && tokens.length > 0) {
        sendPushNotifications(
          newPost.album.title,
          tokens.map(item => item.token)
        );
      }
      const transform = newPost.photo.toString('base64');
      /*#swagger.responses[201] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/PostDetail" }   
      }*/
      return res.status(201).json({
        ...newPost,
        photo: transform,
      });
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//PUT: Update Post
//Params title,photo,description,userId,albumId,locationId,
postRouter.put(
  '/:id',
  isAuthenticated,
  body('title').isString(),
  body('photo').isBase64(),
  body('description').isString().optional(),
  body('userId').isString(),
  body('albumId').isNumeric(),
  body('locationId').isNumeric(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Posts']
    //#swagger.summary= 'Update Post'
    //#swagger.description= 'Returns extended post object'
    /*#swagger.parameters['id']={
      in: 'path',
      required: 'true',
      type: 'string',
      }*/

    /*#swagger.parameters['data']={
      in: 'body',
      required: 'true',
      schema:{$ref: '#/definitions/Post}
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
      const post = req.body;
      const updatedPost = await PostServices.updatePost(
        post
      );
      /*#swagger.responses[201] = { 
        description: 'OK',
        schema: { $ref: "#/definitions/PostDetail" }   
      }*/
      return res.status(201).json(updatedPost);
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//POST: Delete Post
postRouter.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Posts']
    //#swagger.summary= 'Delete post'
    /*
    #swagger.parameters['id']={
      in: 'param'
      required: 'true',
      type: string,
      }*/
    try {
      await PostServices.deletePost(
        parseInt(req.params.id, 10)
      );
      /*#swagger.responses[201] = { 
        description: 'OK',
      }*/
      return res
        .status(201)
        .json('Post deleted successfully');
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);
