
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

# COPY --from=builder /app/build /usr/share/nginx/html

ENV PORT 8090
ENV HOST 0.0.0.0
EXPOSE 8090
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"