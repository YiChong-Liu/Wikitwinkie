FROM node:alpine

USER node
WORKDIR /home/node/app

COPY sessions/package.json ./
RUN npm install
COPY sessions/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
