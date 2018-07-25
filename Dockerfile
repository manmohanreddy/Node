FROM alpine

LABEL maintainer="manmohan"

RUN apk add --update nodejs nodejs-npm

COPY . /src

WORKDIR /src

RUN npm install

EXPOSE 3501

ENTRYPOINT ["node", "./index.js"]