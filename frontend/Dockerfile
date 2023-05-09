FROM node:19-alpine3.16 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG REACT_APP_BASE_URL

EXPOSE 3000

RUN npm run build



FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=builder /app/build /usr/share/nginx/html

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"