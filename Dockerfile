FROM node:14.17-alpine
RUN mkdir /src && mkdir /src/app
RUN npm install typescript@3.4.5 -g && npm install -g jest
RUN apk add git && apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ gnu-libiconv
WORKDIR /src/app
COPY package*.json yarn.lock /src/app/
RUN yarn install --frozen-lockfile
COPY . /src/app
RUN npm run build
CMD /bin/sh -c "node dist/src/main.js"