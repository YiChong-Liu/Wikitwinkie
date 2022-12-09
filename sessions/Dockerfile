FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY sessions/package.json ./
RUN npm install
COPY sessions/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
