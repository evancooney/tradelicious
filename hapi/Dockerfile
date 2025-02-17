# Base image
FROM node:18

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

RUN yarn run build

# Start the server using the production build
CMD [ "node", "dist/index.js" ]

# Exposing server port
EXPOSE 4000