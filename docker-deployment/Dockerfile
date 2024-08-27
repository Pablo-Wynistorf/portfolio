FROM ubuntu:latest as builder

WORKDIR /src

RUN apt update && \
    apt install -y git && \
    apt install -y hugo

RUN hugo

FROM alpine:latest

RUN apk update && \
    apk add --no-cache nginx

WORKDIR /usr/share/nginx/html

COPY --from=builder /src/public/ .

 COPY nginx.conf /etc/nginx/nginx.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
