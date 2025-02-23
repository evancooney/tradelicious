FROM node:18
    
WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3456

CMD ["node", "start"]