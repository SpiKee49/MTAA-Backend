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
//Params title, description?, tags?,ownerId
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
