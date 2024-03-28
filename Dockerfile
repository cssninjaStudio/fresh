FROM bitnami/node:20 AS build
WORKDIR /app

RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


FROM bitnami/nginx:1.25 AS prod
WORKDIR /app

COPY --from=build /app/dist .
COPY ./nginx/alpinejs.conf /opt/bitnami/nginx/conf/server_blocks/nginx.conf