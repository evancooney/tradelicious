# Base image
FROM node:18

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Start the server using the production build
#CMD [ "node", "index.js" ]
CMD ["npm", "run", "start" ]

# Exposing server port
EXPOSE 3000
