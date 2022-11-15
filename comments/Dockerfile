FROM node:alpine

USER node
WORKDIR /home/node/app

COPY comments/package.json ./
RUN npm install
COPY comments/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
