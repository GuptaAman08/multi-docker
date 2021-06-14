# Use an existing docker image as a base
FROM node:alpine

# All following commands in this file and also the one that you will run in cmd/terminal will be relative to this command
# Eg when you try to open a shell inside the running container it will open at /usr/app and not at root level. 
# Another example is it copies the project files and folder inside of /usr/app and not at root level.
WORKDIR /usr/app

# Download and install a dependency
COPY ./package.json ./
RUN npm install

# Inorder to avoid re-installing all packages when making changes in code and migrating to container
COPY ./ ./

# Tell the image what to do when it starts as a containaer.
CMD ["npm", "start"]