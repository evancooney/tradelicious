FROM node:18
    
WORKDIR /app

COPY package*.json ./
RUN yarn install

RUN yarn add newrelic

COPY . .
RUN { echo 'import "newrelic";'  ; cat src/index.js ; } > temp  && mv temp  src/index.js
EXPOSE 3333

ENTRYPOINT NODE_ENV=production node -r newrelic src/index.js