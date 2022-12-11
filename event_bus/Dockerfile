FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY event_bus/package.json ./
RUN npm install
COPY event_bus/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
