FROM node:alpine

USER node
WORKDIR /home/node/app

COPY article_vote/package.json ./
RUN npm install
COPY article_vote/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]