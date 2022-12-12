FROM node:alpine

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY articleserving/package.json ./
RUN npm install
COPY articleserving/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
