FROM node:19-alpine3.16 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

# ARG  REACT_APP_WEBSOCKET_URL

# ARG REACT_APP_BASE_URL

# ENV REACT_APP_WEBSOCKET_URL=ws://backend-iweogtomcq-ew.a.run.app:3005 REACT_APP_BASE_URL=https://backend-iweogtomcq-ew.a.run.app
ENV REACT_APP_WEBSOCKET_URL ws://backend:3005
ENV REACT_APP_BASE_URL http://backend:5000


EXPOSE 3000

RUN npm run build