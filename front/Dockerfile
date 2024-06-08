FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN chmod +x node_modules/.bin/next

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
