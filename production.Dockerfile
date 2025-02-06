FROM node:20.18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --silent

COPY . ./

RUN npm run build

FROM node:20.18-alpine AS runtime

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
