FROM node:22 AS current-alpine3.20

WORKDIR /app

COPY package*.json /app

RUN npm install --silent

COPY . ./

VOLUME ["/app"]

EXPOSE 3000

CMD ["npm", "run", "start"]