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
    //#swagger.tags = ['Locations']
    //#swagger.summary = 'List all locations'
    //#swagger.description: = 'Returns a list of all locations, optionally filtered by search term'
    /*#swagger.parameters['search'] = {
      in: query,
      schema:{type: string},
      description: 'A search term to filter the list of locations'
    }*/ 
    try {
      const locations =
        await LocationServices.listAllLocations(
          req.query.search?.toString()
        );
      /*#swagger.responses[200] = { 
      description: 'OK',
      schema: { $ref: "#/definitions/LocationList" }   
      }*/
      return res.status(200).json(locations);
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal Server Error'  
      }*/
      return res.status(500).json(err);
    }
  }
);

//GET: Find single Location by it's id

locationRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => { 
    //#swagger.tags = ['Locations']
    //#swagger.summary = 'Get location by id'
    //#swagger.description = 'Retrieve an location by its id'
    /*#swagger.parameters['id'] = {
      in: 'path',
      description: 'Numeric ID of the location to retrieve',
      required: 'true',
      type: 'integer'
    }*/
    const locationId: number = parseInt(req.params.id, 10);

    try {
      const location = await LocationServices.findLocation(
        locationId
      );
      if (location) {
        /*#swagger.responses[200] = { 
          schema:{$ref: "#/definitions/Location"},
          description: 'The location with the given id'    
          }*/
        return res.status(200).json(location);
      }
      /*#swagger.responses[404] = { 
        description: 'Location not found' 
        }
      */
      return res.status(404).json('Location not found');
    } catch (err) {
      /* #swagger.responses[500] = { 
    description: 'Internal server error'  
    } */
      return res.status(500).json(err);
    }
  }
);

//POST: Add Location
//Params name, longitude, latitude
locationRouter.post(
  '/',
  isAuthenticated,
  body('name').isString(),
  body('longitude').isString(),
  body('latitude').isString(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Locations']
    //#swagger.summary = 'Add a new location'
    //#swagger.description = 'Add a new location to the database'
    /*#swagger.parameters['location'] ={
      in: 'body',
      description:'Location that is being added',
      schema: { $ref: "#/definitions/AddLocation" }
    }*/

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /*  #swagger.responses[400] = { 
    description: 'Bad Request' 
    } */
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const location = req.body;
      const newLocation =
        await LocationServices.addLocation(location);
      /*  #swagger.responses[201] = { 
    schema: { $ref: "#/definitions/Location" },   
    description: 'Location created'
    } */
      return res.status(201).json(newLocation);
    } catch (err) {
      /* #swagger.responses[500] = { 
    description: 'Internal server error'  
    } */
      return res.status(500).json(err);
    }
  }
);

//POST: Update Location
//Params  name, longitude, latitude

locationRouter.put(
  '/:id',
  isAuthenticated,
  body('name').isString(),
  body('longitude').isString(),
  body('latitude').isString(),
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Locations']
    // #swagger.summary = 'Update an location by ID'
    // #swagger.description = 'Updates the location with the given ID'
    /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID of the location to be updated',
      required: 'true',
      type: 'integer'
    } */
    /* #swagger.parameters['location'] = {
      in: 'body',
      description: 'Data to update location',
      required: 'true',
      schema: { $ref: "#/definitions/UpdateLocation" }
    } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      /*#swagger.responses[400] = { 
      description: 'Location not found' 
      }*/
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    try {
      const location = req.body;
      const updatedLocation =
        await LocationServices.updateLocation(location);
      /*#swagger.responses[201] = { 
      description: 'Location updated', 
      schema: { $ref: "#/definitions/Location" }
      }*/
      return res.status(201).json(updatedLocation);
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
      return res.status(500).json(err);
    }
  }
);

//POST: Delete Location

locationRouter.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Locations']
    //#swagger.summary = 'Delete an location by ID'
    //#swagger.description = 'Deletes the location with the given ID'
    /*#swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID of location to delete', 
      required: 'true', 
      type: 'integer' 
    } */
    
    try {
      await LocationServices.deleteLocation(
        parseInt(req.params.id, 10)
      );
      /*#swagger.responses[201] = { 
      description: 'Location deleted', 
      schema: { type: 'string' } 
      */
      return res
        .status(201)
        .json('Location deleted successfully');
    } catch (err) {
      /*#swagger.responses[500] = { 
      description: 'Internal server error'  
      } */
      return res.status(500).json(err);
    }
  }
);
