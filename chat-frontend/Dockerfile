FROM node:22-alpine3.19

WORKDIR /src

COPY package* .
COPY ./prisma .

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]