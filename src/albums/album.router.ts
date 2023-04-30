import * as AlbumServices from './album.services';

import { Request, Response } from 'express';
import {
  body,
  query,
  validationResult,
} from 'express-validator';

import express from 'express';
import { isAuthenticated } from '../midlewares';

export const albumRouter = express.Router();

//GET: all Albums
//#swagger.tags = ['Albums']
//#swagger.summary: 'List all albums'
//#swagger.description: 'Returns a list of all albums, optionally filtered by search term'
/*#swagger.parameters['search']:{
  in: query
    schema:
      type: string
    description: 'A search term to filter the list of albums'
}*/
/*#swagger.responses[200] = { 
    description: 'OK'
    schema: { $ref: "#/definitions/Album" },   
    }
*/
/*#swagger.responses[500] = { 
    description: 'Internal Server Error'  
    }
*/
//TODO: swagger.security 
albumRouter.get(
  '/',
  isAuthenticated,
  query('search').isString().optional(),
  async (req: Request, res: Response) => {
    try {
      const albums = await AlbumServices.listAllAlbums(
        req.query.search?.toString()
      );
      return res.status(200).json(albums);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//GET: Find single Album by it's id
/*
  #swagger.tags = ['Albums']
  #swagger.summary: 'Get album by id'
  #swagger.description: 'Retrieve an album by its id'
  #swagger.parameters['id'] = {
        in: 'path',
        description: 'Numeric ID of the album to retrieve'
        required: true,
        type: 'integer'

  #swagger.responses[200] = { 
    description: 'The album with the given id'
    schema: { $ref: "#/definitions/Album" },   
    }

  #swagger.responses[404] = { 
    description: 'Album not found' 
    }

  #swagger.responses[500] = { 
    description: 'Internal server error'  
    }
*/
albumRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    const albumId: number = parseInt(req.params.id, 10);

    try {
      const album = await AlbumServices.findAlbum(albumId);
      if (album) {
        return res.status(200).json(album);
      }

      return res.status(404).json('Album not found');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Add Album
//Params title, description?, tags?, ownerId
//#swagger.tags = ['Albums']
//#swagger.summary: 'Add a new album'
//#swagger.description: 'Add a new album to the database'
/*#swagger.parameters['Album'] ={
  in: 'body',
  description:'album that is being added',
  schema: { $ref: "#/definitions/AddAlbum" }
}*/
/*
  #swagger.responses[201] = { 
    description: 'Album created'
    schema: { $ref: "#/definitions/Album" },   
    }

  #swagger.responses[400] = { 
    description: 'Bad Request' 
    }

  #swagger.responses[500] = { 
    description: 'Internal server error'  
    }
*/
//TODO: swagger.security 
albumRouter.post(
  '/',
  isAuthenticated,
  body('title').isString(),
  body('description').isString().optional(),
  body('tags').isArray().optional(),
  body('ownerId').isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const album = req.body;
      const newAlbum = await AlbumServices.addAlbum(album);
      return res.status(201).json(newAlbum);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Update Album
//Params title, description, tags
// #swagger.tags = ['Albums'] 
// #swagger.summary = 'Update an album by ID' 
// #swagger.description = 'Updates the album with the given ID'
/* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the album to be updated',
        required: true,
        type: 'integer'
} */
/* #swagger.parameters['Album'] = {
        in: 'body',
        description: 'Data to update album',
        required: true,
        schema: { $ref: "#/definitions/UpdateAlbum" }
} */
/*#swagger.responses[201] = { 
  description: 'Album updated', 
  schema: { $ref: "#/definitions/Album" },
  }*/
/*#swagger.responses[404] = { 
  description: 'Album not found' 
  }*/
/*#swagger.responses[500] = { 
  description: 'Internal server error'  
  } */
albumRouter.put(
  '/:id',
  isAuthenticated,
  body('title').isString(),
  body('description').isString().optional(),
  body('tags').isArray().optional(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const album = req.body;
      const updatedAlbum = await AlbumServices.updateAlbum(
        album
      );
      return res.status(201).json(updatedAlbum);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Delete Album
//#swagger.tags = ['Albums']
//#swagger.summary = 'Delete an album by ID'
//#swagger.description = 'Deletes the album with the given ID'
/*#swagger.parameters['id'] = { 
  in: 'path', 
  description: 'ID of album to delete', 
  required: true, 
  type: 'integer' 
} */
/*#swagger.responses[201] = { 
  description: 'Album deleted', 
  schema: { 
    type: 'string' 
  } 
}*/
/*#swagger.responses[500] = { 
  description: 'Internal server error'  
  } */
//TODO swagger.security
albumRouter.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      await AlbumServices.deleteAlbum(
        parseInt(req.params.id, 10)
      );
      return res
        .status(201)
        .json('Album deleted successfully');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
