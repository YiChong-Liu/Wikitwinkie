FROM node:alpine

USER node
WORKDIR /home/node/app

COPY accountmanagement/package.json ./
RUN npm install
COPY accountmanagement/ ./
COPY utils/ ./utils/

CMD ["npm", "start"]
