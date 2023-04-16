FROM node:19-alpine3.16

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]