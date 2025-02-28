# build stage
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN yarn install
RUN yarn add newrelic
COPY . .
RUN { echo 'import "newrelic";'  ; cat src/App.jsx ; } > temp  && mv temp  src/App.jsx
RUN yarn run build

# production stage
FROM nginx:stable as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]