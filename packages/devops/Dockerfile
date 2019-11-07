# specify the node base image with your desired version node:<version>
FROM node:10
# Create app directory
WORKDIR /

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY packages/rp2/package.json ./package.json

COPY dist.web/. ./dist.web/.

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ./packages/rp2/. .
# Overwrite conf for kubernetes
# COPY ./packages/devops/docker.conf ./local.conf
COPY ./packages/devops/rp2-container/kube.conf ./local.conf
EXPOSE 8080

## Launch the wait tool and then your application
CMD npm run init
# replace this with your application's default port
