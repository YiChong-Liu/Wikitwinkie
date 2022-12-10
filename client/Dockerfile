FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY client/package.json ./
RUN npm install
COPY client/ ./
COPY utils/interfaces.ts ./src/utils/interfaces.ts

CMD ["npm", "start"]
