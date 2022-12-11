FROM node:alpine

USER node
WORKDIR /home/node/app

COPY search_engine/package.json ./
RUN npm install
COPY search_engine/ ./
# COPY utils/ ./utils/

CMD ["npm", "start"]
