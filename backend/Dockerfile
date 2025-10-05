FROM node:22
WORKDIR ./
COPY package*.json ./
EXPOSE 5000
RUN npm install
COPY . .
CMD ["node","server.js"]