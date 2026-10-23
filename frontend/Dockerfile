FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine
RUN addgroup -S app && adduser -S app -G app && mkdir -p /var/cache/nginx /var/run /usr/share/nginx/html && chown -R app:app /var/cache/nginx /var/run /usr/share/nginx/html && sed -i 's@pid        /run/nginx.pid;@pid        /tmp/nginx.pid;@' /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
USER app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
