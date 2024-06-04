# Prerequisites

- Nodejs v20

# Installation

- Clone repo
- Create a .env file in the root directory that contains the following:
```
dataDir=C:/lumber (put your data directory here)
```
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
- To use a port other than 3000, you need to add an environment variable to your terminal session before running the server
  - Powershell: `$env:PORT = 4000; node ./index.js`
  - Bash: `PORT=4000 node ./index.js`
- More options can be found here: https://kit.svelte.dev/docs/adapter-node