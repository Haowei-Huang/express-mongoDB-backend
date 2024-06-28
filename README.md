# CRUD with Node.js, Express and MongoDB

This project is a simple Node.js backend using Express and MongoDB. It includes endpoints for CRUD operations on collections and documents in a MongoDB database.

## How to run
- Open the command line under the project folder, install the dependencies
  ``` cmd
  npm install
  ```
- Create a .env file in the root directory and add your MongoDB connection string:
  ``` env
  MONGODB_URL=your_mongodb_connection_string
  ```
- Start the server:
  ``` bash
  npm start
  ```
The server will be running on http://localhost:3000.

## Endpoints
**GET /document/findAll/:collectionName**\
Fetches all documents from the specified collection.

**GET /document/findOne/:collectionName/:documentId**\
Fetches a single document by ID from the specified collection.

**POST /document/createorupdate/:collectionName**\
Inserts a new document into the specified collection.

**PUT /document/updateOne/:collectionName/:documentId**\
Updates an existing document by ID in the specified collection.

**DELETE /document/deleteOne/:collectionName/:documentId**\
Deletes a document by ID from the specified collection.

## Project Structure

``` 
├── controllers
│   └── document.controller.js
├── routes
│   └── document.routes.js
├── server
│   └── db.js
├── .env
├── package.json
└── server.js
```

- **controllers/document.controller.js**: Contains the logic for handling requests and interacting with the database.
- **routes/document.routes.js**: Defines the routes and associates them with controller functions.
- **server/db.js**: Establishes the connection to the MongoDB database.
- **server.js**: Sets up the Express server, middleware, and routes.
