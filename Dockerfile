FROM node:lts-alpine3.10 as builder

RUN apk add python3 make gcc libc-dev g++

WORKDIR /home/node/app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY src/ src/

ENV NODE_ENV=production

RUN npm install

COPY public/ public/
RUN npm run-script build

FROM nginx:1.19.4-alpine

COPY --from=builder /home/node/app/build/ /usr/share/nginx/html
