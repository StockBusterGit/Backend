FROM node:20.18-alpine3.20 AS build

WORKDIR /app

COPY package*.json /app

RUN npm ci --silent

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "start"]
