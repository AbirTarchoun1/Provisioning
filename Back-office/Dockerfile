# Stage 1: Build the Angular app
FROM node:14 AS angular-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve the Angular app with Nginx
FROM nginx:1.21
COPY --from=angular-build /app/dist/ /usr/share/nginx/html
