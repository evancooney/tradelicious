# build stage
FROM node:20 as build
WORKDIR /frontend
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# production stage
FROM nginx:stable as production
COPY --from=build /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]