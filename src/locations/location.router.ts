import * as LocationServices from './location.services';

import { Request, Response } from 'express';
import {
  body,
  param,
  query,
  validationResult,
} from 'express-validator';

import express from 'express';
import { isAuthenticated } from '../midlewares';

export const locationRouter = express.Router();

//GET: all Locations
locationRouter.get(
  '/',
  isAuthenticated,
  query('search').isString().optional(),
  async (req: Request, res: Response) => {
    try {
      const locations =
        await LocationServices.listAllLocations(
          req.query.search?.toString()
        );
      return res.status(200).json(locations);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//GET: Find single Location by it's id
locationRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    const locationId: number = parseInt(req.params.id, 10);

    try {
      const location = await LocationServices.findLocation(
        locationId
      );
      if (location) {
        return res.status(200).json(location);
      }

      return res.status(404).json('Location not found');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Add Location
//Params name,longitude, latitude
locationRouter.post(
  '/',
  isAuthenticated,
  body('name').isString(),
  body('longitude').isString(),
  body('latitude').isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const location = req.body;
      const newLocation =
        await LocationServices.addLocation(location);
      return res.status(201).json(newLocation);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Update Location
//Params  name,longitude, latitude
locationRouter.put(
  '/:id',
  isAuthenticated,
  body('name').isString(),
  body('longitude').isString(),
  body('latitude').isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const location = req.body;
      const updatedLocation =
        await LocationServices.updateLocation(location);
      return res.status(201).json(updatedLocation);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//POST: Delete Location
locationRouter.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      await LocationServices.deleteLocation(
        parseInt(req.params.id, 10)
      );
      return res
        .status(201)
        .json('Location deleted successfully');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
