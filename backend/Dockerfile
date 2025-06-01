FROM node:23-alpine-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

EXPOSE 3005

CMD [ "npm", "run", "prod" ]