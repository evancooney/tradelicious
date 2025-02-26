FROM node:18
    
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

ENTRYPOINT NODE_ENV=production node -r newrelic src/index.js