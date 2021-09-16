FROM node:latest
WORKDIR app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build

ARG BOT_TOKEN
RUN rm -rf .env
RUN echo "BOT_TOKEN=$BOT_TOKEN" > .env
# we need ENV vars

CMD ["node", "build/index.js"]