# Build layer
FROM node:18.20.1 AS build

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

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
