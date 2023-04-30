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
//#swagger.tags = ['Locations']
//#swagger.summary: 'List all locations'
//#swagger.description: 'Returns a list of all locations, optionally filtered by search term'
/*#swagger.parameters['search']:{
  in: query
    schema:
      type: string
    description: 'A search term to filter the list of locations'
}*/
/*#swagger.responses[200] = { 
    description: 'OK'
    schema: { $ref: "#/definitions/Location" },   
    }
*/
/*#swagger.responses[500] = { 
    description: 'Internal Server Error'  
    }
*/
//TODO: swagger.security
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
    /*
  #swagger.tags = ['Locations']
  #swagger.summary: 'Get location by id'
  #swagger.description: 'Retrieve an location by its id'
  #swagger.parameters['id'] = {
        in: 'path',
        description: 'Numeric ID of the location to retrieve'
        required: true,
        type: 'integer'

  #swagger.responses[200] = { 
    description: 'The location with the given id'
    content:
      application/json:
        schema:
          type: array
          items:  $ref: "#/definitions/Location"
    }

  #swagger.responses[404] = { 
    description: 'Location not found' 
    }

  #swagger.responses[500] = { 
    description: 'Internal server error'  
    }
*/
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
//Params name, longitude, latitude
locationRouter.post(
  '/',
  isAuthenticated,
  body('name').isString(),
  body('longitude').isString(),
  body('latitude').isString(),
  async (req: Request, res: Response) => {
    //#swagger.tags = ['Locations']
    //#swagger.summary: 'Add a new location'
    //#swagger.description: 'Add a new location to the database'
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
        required: true,
        type: 'integer'
} */
    /* #swagger.parameters['Location'] = {
        in: 'body',
        description: 'Data to update location',
        required: true,
        schema: { $ref: "#/definitions/UpdateLocation" }
} */
    /*#swagger.responses[201] = { 
  description: 'Location updated', 
  schema: { $ref: "#/definitions/Location" },
  }*/
    /*#swagger.responses[404] = { 
  description: 'Location not found' 
  }*/
    /*#swagger.responses[500] = { 
  description: 'Internal server error'  
  } */
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

//TODO swagger.security
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
  required: true, 
  type: 'integer' 
} */
    /*#swagger.responses[201] = { 
  description: 'Location deleted', 
  schema: { 
    type: 'string' 
  } 
}*/
    /*#swagger.responses[500] = { 
  description: 'Internal server error'  
  } */
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
