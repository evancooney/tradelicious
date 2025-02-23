FROM node:18
    
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

#CMD ["node", "-r newrelic src/index.js"]

ENTRYPOINT NODE_ENV=production node -r newrelic src/index.js