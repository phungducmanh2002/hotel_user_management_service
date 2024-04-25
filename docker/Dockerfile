FROM node:21.7.1
WORKDIR /server
COPY ./*.json ./
RUN [ "npm", "install" ]
COPY ./*.js ./
EXPOSE 3000
CMD [ "npm", "start" ]