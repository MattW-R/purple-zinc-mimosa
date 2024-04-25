# Build layer
FROM node:18.20.1 AS build

WORKDIR /app

COPY package.json yarn.lock lerna.json ./
COPY apps/seed/package.json app/seed/package.json
COPY apps/api/package.json app/api/package.json
COPY packages/schemas/package.json packages/schemas/package.json

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# API layer
FROM node:18.20.1 AS api

WORKDIR /app

COPY --from=build /app .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["yarn", "lerna", "run", "start", "--scope", "@apps/api"]

# Seed layer
FROM node:18.20.1 AS seed

WORKDIR /app

COPY --from=build /app .

ENV NODE_ENV=production

CMD ["yarn", "lerna", "run", "start", "--scope", "@apps/seed"]
