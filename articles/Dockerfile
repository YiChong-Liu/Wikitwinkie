FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY articles/package.json ./
RUN npm install
COPY articles/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
