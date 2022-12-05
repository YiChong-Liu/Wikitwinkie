FROM node:alpine

USER node
WORKDIR /home/node/app

COPY image_management/package.json ./
RUN npm install
COPY image_management/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]