FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /server/package*.json ./
COPY /server/build ./build

RUN npm install --omit=dev
RUN apt-get -y update
RUN apt-get install -y ffmpeg
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]
