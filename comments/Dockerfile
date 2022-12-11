FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY comments/package.json ./
RUN npm install
COPY comments/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
