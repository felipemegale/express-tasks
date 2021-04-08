FROM node:fermium

WORKDIR /usr/app

COPY package*.json ./

RUN ls -a
RUN npm install

COPY . .

EXPOSE 8000

RUN ls -a

CMD ["npm","start"]
