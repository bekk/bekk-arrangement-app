FROM node:11.14.0

ENV PORT=80

COPY app /app

WORKDIR /app
RUN npm install
WORKDIR /app/node_modules
RUN npm rebuild node-sass
WORKDIR /app
RUN npm run build

CMD npm run server