# CRUD with Node.js, Express and MongoDB

This project is a simple Node.js backend using Express and MongoDB. It includes endpoints for CRUD operations on collections and documents in a MongoDB database.

## How to run
- Open the command line under the project folder, install the dependencies
  ``` cmd
  npm install
  ```
- Generate a RSA Key pair: you can generate it yourself or use this online tool: https://cryptotools.net/rsagen
- Convert the keys to BASE 64
  1. Convert Key to Base 64
  ```javascript
  // Run this code in a JS file on your Dev Machine.
  const privateKey= `-----BEGIN PRIVATE KEY-----\nMIIEvSomeMoreCharacterHererplw==\n-----END PRIVATE KEY-----\n`
  const buff = Buffer.from(privateKey).toString('base64');
  console.log(buff);
  ```
  Note: You don't need to commit/include the above code in your project. This is just to generate the base64 string of the key.

  2. Copy the console log data to .env file
  ``` env
  PRIVATE_KEY = 'akgjhakdgjhasgf'
  ```
  3. Using the Key in the code
  ```javascript
  const key = Buffer.from(process.env.PRIVATE_KEY , 'base64').toString('ascii');
  // Use key anywhere in your code.
  ```
  reference: https://stackoverflow.com/a/68730638
- Create a .env file in the root directory and add your MongoDB connection string, your BASE 64 RSA256 public key and private key:
  ``` env
  MONGODB_URL=your_mongodb_connection_string
  JWT_PUBLIC=your_base64_public_key
  JWT_PRIVATE=your_base64_private_key
  ```
- Start the server:
  ``` bash
  npm start
  ```
The server will be running on http://localhost:3000.

## Project Structure

``` 
├── controllers
│   └── document.controller.js
|   └── user.controller.js
|   └── hotel.controller.js
|   └── booking.controller.js
├── routes
│   └── document.routes.js
|   └── user.routes.js
|   └── hotel.routes.js
|   └── booking.routes.js
├── server
│   └── db.js
├── .env
├── package.json
└── server.js
```
- **controllers/\*.controller.js**: Contains the logic for handling requests and interacting with the database.
- **routes/\*.routes.js**: Defines the routes and associates them with controller functions.
- **server/db.js**: Establishes the connection to the MongoDB database.
- **server.js**: Sets up the Express server, middleware, and routes.
- **jwt.js**: Helper class to generate jwt token.
