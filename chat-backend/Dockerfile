FROM node:22-alpine3.19

WORKDIR /src

COPY package* .

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3001

CMD [ "node", "./dist/index.js" ]