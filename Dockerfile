# Base
FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./

# Install packages
FROM base AS development
RUN npm ci
USER node

# Build Stage
FROM base AS build
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build

# Production
FROM node:22-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
ENV NODE_ENV production
CMD ["sh", "-c", "node ./node_modules/typeorm/cli.js migration:run -d ./dist/shared/configs/data-source.config.js && node dist/main"]
