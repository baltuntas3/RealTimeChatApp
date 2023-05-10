FROM node:19-alpine3.16 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG REACT_APP_BASE_URL

EXPOSE 3000

RUN npm run build



FROM nginx:alpine

RUN apk update && apk add openssl

RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048 &&\
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/certs/self.key -out /etc/ssl/certs/self.crt \
    -subj "/C=TR/ST=./L=./O=. Code/OU=./CN=."

COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY ssl-params.conf /etc/nginx/ssl-params.conf

COPY --from=builder /app/build /usr/share/nginx/html

ENV PORT 80
ENV HOST 0.0.0.0

CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"