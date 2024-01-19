FROM node:14-alpine
WORKDIR /app
COPY . .
RUN mv .env.example .env
RUN npm install
CMD npm start