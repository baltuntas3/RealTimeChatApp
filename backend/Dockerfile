FROM node:19-alpine3.16

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

EXPOSE 3005

CMD [ "npm", "start" ]