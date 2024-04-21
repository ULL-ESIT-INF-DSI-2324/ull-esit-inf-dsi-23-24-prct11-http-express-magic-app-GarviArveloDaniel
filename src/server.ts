import express from 'express';
import { Collection } from './collection.js';

// Create a new instance of the Collection class
const collection = new Collection();

// Create an instance of the Express server
const server = express();

// Middleware to parse JSON data in the request body
server.use(express.json());

/**
 * GET /cards
 * Endpoint to retrieve a list of cards or a specific card
 * @param req - The request object
 * @param res - The response object
 */
server.get('/cards', (req, res) => {
  if (!req.query.user) {
    // If user is not provided in the query parameters, send an error response
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.'
    });
    return;
  }
  if (!req.query.id) {
    // If id is not provided in the query parameters, call the list method of the collection
    collection.list(req.query.user as string, (error, result) => {
      if (error) {
        // If there is an error, send an error response
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        // If successful, send a success response with the result
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  } else {
    // If id is provided in the query parameters, call the read method of the collection
    collection.read(req.query.user as string, parseInt(req.query.id as string), (error, result) => {
      if (error) {
        // If there is an error, send an error response
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        // If successful, send a success response with the result
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});

/**
 * POST /cards
 * Endpoint to add a new card
 * @param req - The request object
 * @param res - The response object
 */
server.post('/cards', (req, res) => {
  if (!req.query.user) {
    // If user is not provided in the query parameters, send an error response
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.',
    });
  } else {
    // If user is provided, call the add method of the collection with the parsed request body
    collection.add(req.query.user as string, req.body, (error, result) => {
      if (error) {
        // If there is an error, send an error response
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        // If successful, send a success response with the result
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});

/**
 * DELETE /cards
 * Endpoint to remove a card
 * @param req - The request object
 * @param res - The response object
 */
server.delete('/cards', (req, res) => {
  if (!req.query.user) {
    // If user is not provided in the query parameters, send an error response
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.',
    });
    return;
  }
  if (!req.query.id) {
    // If id is not provided in the query parameters, send an error response
    res.send({
      status: 'Error',
      answer: 'An id has to be provided.',
    });
  } else {
    // If user and id are provided, call the remove method of the collection
    collection.remove(req.query.user as string, parseInt(req.query.id as string), (error, result) => {
      if (error) {
        // If there is an error, send an error response
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        // If successful, send a success response with the result
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});

/**
 * PATCH /cards
 * Endpoint to modify a card
 * @param req - The request object
 * @param res - The response object
 */
server.patch('/cards', (req, res) => {
  if (!req.query.user) {
    // If user is not provided in the query parameters, send an error response
    res.send({
      status: 'Error',
      answer: 'A user has to be provided.',
    });
    return;
  }
  if (!req.query.id) {
    // If id is not provided in the query parameters, send an error response
    res.send({
      status: 'Error',
      answer: 'An id has to be provided.',
    });
  } else {
    if (parseInt(req.query.id as string) !== req.body.id) {
      // If the id in the query parameters is not the same as the id in the request body, send an error response
      res.send({
        status: 'Error',
        answer: 'The id in the body has to be the same as in the query string.',
      });
      return;
    }
    // If user and id are provided and the ids match, call the modify method of the collection with the parsed request body
    collection.modify(req.query.user as string, req.body, (error, result) => {
      if (error) {
        // If there is an error, send an error response
        res.send({
          status: 'Error',
          answer: error
        });
      } else {
        // If successful, send a success response with the result
        res.send({
          status: 'Success',
          answer: result
        });
      }
    });
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is up on port 3000');
});