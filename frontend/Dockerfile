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



FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=builder /app/build /usr/share/nginx/html

ENV PORT 8090
ENV HOST 0.0.0.0
EXPOSE 8090
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"