# # Start your image with a node base image
# FROM node:24-alpine

# # The /app directory should act as the main application directory
# WORKDIR /app

# # Copy the app package and package-lock.json file
# COPY package*.json ./
# RUN npm install
# # Copy local directories to the current local directory of our docker image (/app)
# COPY . .

# # Install node packages, install serve, build the app, and remove dependencies at the end
# RUN npm run build
# RUN npm prune --production

# EXPOSE 3000

# # Start the app using serve command
# CMD [ "node", "./index.js", "build" ]

# docker build -t lumber .

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]