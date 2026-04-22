FROM node:24.12.0-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM base AS dev
COPY . .
EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

FROM base AS build
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:1.27-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/familiendashboard/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
