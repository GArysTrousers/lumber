# Lumber
A server to send your logs to.

- Search and filter your logs
- Script builder
- Secure access

## Installation

### Prerequisites

- Nodejs v20

### Getting it ready
- Clone repo
- Create a .env file in the root directory that contains the following:
```
dataDir=[put your data directory here, no slashes on the end]
```
Note: on windows, use forward slashes as in C:/path/to/your/data
- Start a terminal in the project directory and run:
  - `npm i`
  - `npm run init`
  - `npm run build`

This will create the data directory and database and then build the app.
It will also create a user with:
- Username: lumber
- Password: mill

## Running the Server

Start a terminal in the ./build directory and run:

`node ./index.js`
### Environment Variables
  - PORT - The port that the server will be run on. (Default: 3000)
  - BODY_SIZE_LIMIT - Max size, in bytes, a request can be, including any attachments. (Default: 512kb)
  - More options can be found here: https://kit.svelte.dev/docs/adapter-node
### Examples:
  - Powershell: `$env:PORT = 4000; $env:BODY_SIZE_LIMIT = 5000000; node ./index.js`
  - Bash: `PORT=4000 BODY_SIZE_LIMIT=5000000 node ./index.js`