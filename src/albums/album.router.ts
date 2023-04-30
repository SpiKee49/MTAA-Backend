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
albumRouter.get(
  '/',
  isAuthenticated,
  query('search').isString().optional(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Albums']
    //#swagger.summary = 'List all albums'
    //#swagger.description = 'Returns a list of all albums, optionally filtered by search term'
    /*#swagger.parameters['search'] = {
      in: query,
      schema:{
        type: string
      },  
      description: 'A search term to filter the list of albums'
    }*/
    
    try {
      const albums = await AlbumServices.listAllAlbums(
        req.query.search?.toString()
      );
      /*#swagger.responses[200] = { 
      description: 'OK',
      schema: { $ref: "#/definitions/Album" }   
      }*/
      return res.status(200).json(albums);
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//GET: Find single Album by it's id

albumRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => { 
    //#swagger.tags = ['Albums']
    //#swagger.summary = 'Get album by id'
    //#swagger.description = 'Retrieve an album by its id'
    /*#swagger.parameters['id'] = {
        in: 'path',
        description: 'Numeric ID of the album to retrieve'
        required: true,
        type: 'integer'
    }*/
    const albumId: number = parseInt(req.params.id, 10);

    try {
      const album = await AlbumServices.findAlbum(albumId);
      if (album) {
        /*#swagger.responses[200] = { 
          description: 'The album with the given id'
          schema: { $ref: "#/definitions/Album" },   
          }*/
        return res.status(200).json(album);
      }
      /*#swagger.responses[404] = { 
        description: 'Album not found' 
        }*/
      return res.status(404).json('Album not found');
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal server error'  
        }*/
      return res.status(500).json(err);
    }
  }
);

//POST: Add Album

//TODO: swagger.security
albumRouter.post(
  '/',
  isAuthenticated,
  body('title').isString(),
  body('description').isString().optional(),
  body('tags').isArray().optional(),
  body('ownerId').isString(),
  async (req: Request, res: Response) => {
    //Params title, description?, tags?, ownerId
    //#swagger.tags = ['Albums']
    //#swagger.summary = 'Add a new album'
    //#swagger.description = 'Add a new album to the database'
    /*#swagger.parameters['Album'] ={
      in: 'body',
      description:'album that is being added',
      schema: { $ref: "#/definitions/AddAlbum" }
    }*/

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /*#swagger.responses[400] = { 
        description: 'Bad Request' 
        }*/
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const album = req.body;
      const newAlbum = await AlbumServices.addAlbum(album);
      /*#swagger.responses[201] = { 
        description: 'Album created'
        schema: { $ref: "#/definitions/Album" },   
      }*/
      return res.status(201).json(newAlbum);
    } catch (err) {
      /*#swagger.responses[500] = { 
        description: 'Internal server error'  
        }*/
      return res.status(500).json(err);
    }
  }
);

//POST: Update Album
//Params title, description, tags

albumRouter.put(
  '/:id',
  isAuthenticated,
  body('title').isString(),
  body('description').isString().optional(),
  body('tags').isArray().optional(),
  async (req: Request, res: Response) => {
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
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /*#swagger.responses[404] = { 
      description: 'Album not found' 
      }*/
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const album = req.body;
      const updatedAlbum = await AlbumServices.updateAlbum(
        album
      );
      /*#swagger.responses[201] = { 
      description: 'Album updated', 
      schema: { $ref: "#/definitions/Album" }
      }*/
      return res.status(201).json(updatedAlbum);
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
      return res.status(500).json(err);
    }
  }
);

//POST: Delete Album
albumRouter.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Albums']
    //#swagger.summary = 'Delete an album by ID'
    //#swagger.description = 'Deletes the album with the given ID'
    /*#swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID of album to delete', 
      required: true, 
      type: 'integer' 
    } */
    
    try {
      await AlbumServices.deleteAlbum(
        parseInt(req.params.id, 10)
      );
      /*#swagger.responses[201] = { 
      description: 'Album deleted', 
      schema: { 
        type: 'string' 
      } 
      }*/
      return res
        .status(201)
        .json('Album deleted successfully');
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
      return res.status(500).json(err);
    }
  }
);
