FROM node:12-stretch
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install && npm cache clean --force
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 8080
CMD [ "node", "./server.js" ]