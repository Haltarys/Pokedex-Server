FROM node:18-alpine AS base

WORKDIR /app

EXPOSE 3001

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

FROM base AS development

CMD [ "yarn", "run", "start:dev" ]

FROM base AS production

ENV NODE_ENV=production

RUN yarn run build

CMD [ "yarn", "run", "start:prod" ]
