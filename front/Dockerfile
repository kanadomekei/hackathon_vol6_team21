FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install next react react-dom

RUN chmod +x node_modules/.bin/next

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
