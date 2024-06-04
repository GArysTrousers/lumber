# Prerequisites

- Nodejs v20

# Installation

- Clone repo
- Create a .env file in the root directory (see below)
- Start a terminal in the root directory and run:
  - `npm i`
  - `npm run init`
  - `npm run build`

This will create the database and build the app.
It will also create a user with:
- Username: lumber
- Password: mill

# Running the Server

- Start a terminal in the ./build directory and run:
  - `node index.js`

# .env
```
dataDir=C:/lumber
```