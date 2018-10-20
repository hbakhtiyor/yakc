FROM node:alpine

ENV NODE_ENV production
ENV JWT_SECRET abc

RUN mkdir -p /var/www/yakc/

WORKDIR /var/www/yakc

COPY package*.json ./

RUN npm install pm2 -g

RUN npm install --only=production && \
    npm cache clean

COPY . .

EXPOSE 8000
CMD ["pm2", "start", "app.js", "-i", "0", "--name=\"yakc\"", "--no-daemon"]
