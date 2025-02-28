FROM node:18
    
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN { echo 'import "newrelic";'  ; cat src/index.ts ; } > temp  && mv temp  src/index.js
EXPOSE 3333

ENTRYPOINT NODE_ENV=production node -r newrelic src/index.js