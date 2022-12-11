FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY comment_votes/package.json ./
RUN npm install
COPY comment_votes/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
