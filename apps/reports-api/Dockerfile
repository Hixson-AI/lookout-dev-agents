FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY src ./src
EXPOSE 3456
CMD ["npm", "run", "start"]
