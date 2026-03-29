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

RUN set -eux; \
    mkdir -p /out; \
    if find dist -maxdepth 3 -type d -name browser | grep -q .; then \
      BROWSER_DIR="$(find dist -maxdepth 3 -type d -name browser | head -n 1)"; \
      cp -R "${BROWSER_DIR}/." /out/; \
    else \
      APP_DIR="$(find dist -maxdepth 1 -mindepth 1 -type d | head -n 1)"; \
      cp -R "${APP_DIR}/." /out/; \
    fi


FROM nginx:1.27-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /out/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
