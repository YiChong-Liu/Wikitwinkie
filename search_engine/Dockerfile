FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY search_engine/package.json ./
RUN npm install
COPY search_engine/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
