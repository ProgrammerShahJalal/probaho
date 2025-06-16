FROM node:22-alpine
WORKDIR /var/www
COPY ./package.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "server"]
