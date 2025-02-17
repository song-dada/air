# node 20 ver 
FROM node:20

# workdirectory
WORKDIR /app

# package.json  / tsconfig.json copy

COPY package.json tsconfig.json .

# install
RUN npm install

# sourceCode Copy
COPY src/ src/
COPY public/ public/

# set port
EXPOSE 3000

# run
CMD ["npm", "start"]


