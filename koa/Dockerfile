# Base image
FROM node:18

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn install

RUN yarn add newrelic
RUN { echo 'import "newrelic";'  ; cat src/index.ts ; } > temp  && mv temp  src/index.ts

# Bundle app source
COPY . .

RUN yarn run build

# Start the server using the production build
ENTRYPOINT NODE_ENV=production node -r newrelic dist/index.js

# Exposing server port
EXPOSE 5555