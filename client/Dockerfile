FROM node:alpine

USER node
WORKDIR /home/node/app

COPY client/package.json ./
RUN npm install
COPY client/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
