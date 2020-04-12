FROM node:13.12-alpine3.10

RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package.json /home/node/app
COPY package-lock.json /home/node/app

RUN npm ci

COPY . /home/node/app
RUN cp .env.dist .env

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh", "npm", "run-script" ]