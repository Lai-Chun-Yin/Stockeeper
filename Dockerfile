FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
RUN sudo npm install knex -g
RUN knex migrate:latest --env production
CMD ["npm","run","start"]