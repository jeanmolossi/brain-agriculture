FROM node:22-alpine3.19 as BUILDER

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY ./src /usr/src/app/src
COPY package.json /usr/src/app/package.json
COPY pnpm-lock.yaml /usr/src/app/pnpm-lock.yaml
COPY tsconfig.json /usr/src/app/tsconfig.json

RUN pnpm install && \
  pnpm run build

FROM node:22-alpine3.19 as RUNNER

COPY --from=BUILDER /usr/src/app/dist /usr/src/app/dist
COPY --from=BUILDER /usr/src/app/node_modules /usr/src/app/node_modules

USER node

CMD ["node", "/usr/src/app/dist", "index.js"]
