FROM node:11-alpine

RUN apk add --no-cache file libunwind build-base python zeromq-dev tzdata \
    && rm -rf /var/cache/apk/* \
    && cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime \
    && echo "Europe/Berlin" >  /etc/timezone

ADD code /home/node/code

WORKDIR /home/node/code
RUN npm install

USER node

CMD [ "npm", "run", "start"]
