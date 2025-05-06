# CRUD with Node.js, Express, and MongoDB

This project is a simple Express backend that includes:
- Endpoints for CRUD operations on collections and documents in a MongoDB database.
- JWT-based authentication workflow with `accessToken` and `refreshToken`.
- A refresh token revocation mechanism for enhanced security.

---

## Features
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on various collections.
- **JWT Authentication**: Secure endpoints using `accessToken` and `refreshToken`.
- **Refresh Token Revocation**: Invalidate refresh tokens during logout or when they are no longer valid.
- **Modular Structure**: Organized controllers, routes, and database connection for scalability.

---

## Prerequisites
- **Node.js**: Ensure you have Node.js installed on your system.
- **MongoDB**: A running MongoDB instance (local or cloud, e.g., MongoDB Atlas).
- **RSA Key Pair**: Generate an RSA key pair for signing and verifying JWT tokens.

---

## How to Run

### 1. Install Dependencies
Run the following command in the project directory to install all required dependencies:
```bash
npm install
```

### 2. Generate an RSA Key Pair
You can generate an RSA key pair using an online tool like [cryptotools.net](https://cryptotools.net/rsagen) or any other method. Convert the keys to Base64 format for use in the project.

#### Convert Private Key to Base64
Run the following code on your local machine to convert your private key to Base64:
```javascript
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvSomeMoreCharacterHere==
-----END PRIVATE KEY-----`;

const buff = Buffer.from(privateKey).toString('base64');
console.log(buff);
```
Copy the Base64-encoded private key and save it in your `.env` file.

### 3. Create a `.env` File
Create a `.env` file in the root directory of the project and add the following environment variables:
```env
MONGODB_URL=your_mongodb_connection_string
JWT_ACCESS_PRIVATE=your_base64_private_key_for_access_token
JWT_ACCESS_PUBLIC=your_base64_public_key_for_access_token
JWT_REFRESH_PRIVATE=your_base64_private_key_for_refresh_token
JWT_REFRESH_PUBLIC=your_base64_public_key_for_refresh_token
```

### 4. Start the Server
Run the following command to start the server:
```bash
npm start
```
The server will be running at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

``` 
├── controllers
│   ├── document.controller.js (not used)
│   ├── user.controller.js
│   ├── hotel.controller.js
│   └── booking.controller.js
├── routes
│   ├── document.routes.js (not used)
│   ├── user.routes.js
│   ├── hotel.routes.js
│   └── booking.routes.js
├── server
│   └── db.js
├── .env
├── package.json
└── index.js
```

### Explanation of Key Files
- **controllers/\*.controller.js**: Contains the logic for handling requests and interacting with the database.
- **routes/\*.routes.js**: Defines the routes and associates them with controller functions.
- **server/db.js**: Establishes the connection to the MongoDB database.
- **index.js**: Sets up the Express server, middleware, and routes.
- **jwt.js**: Helper class to generate and verify JWT tokens.

---

## Security Features
- **JWT Authentication**: Ensures secure access to protected routes.
- **HttpOnly Cookies**: Stores `refreshToken` in HttpOnly cookies to prevent XSS attacks.
- **Token Revocation**: Invalidates refresh tokens during logout or when they are no longer valid.

---

## Troubleshooting
### Common Issues
1. **MongoDB Authentication Failed**:
   - Ensure your `MONGODB_URL` is correct and includes valid credentials.
   - Whitelist your IP address in MongoDB Atlas if using a cloud database.

2. **Invalid JWT Token**:
   - Verify that your RSA keys are correctly encoded in Base64.
   - Ensure the keys match between the server and the `.env` file.

3. **Refresh Token Not Working**:
   - Check if the refresh token is being stored and validated correctly in the database.
   - Ensure the `refreshToken` cookie is being sent with the request.

---