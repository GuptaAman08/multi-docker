FROM node:alpine
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html
# Default command of the Nginx image is going to start the Nginx for us, we don't need to 
# mention any start-up command. So, when the container starts up, it will start Nginx automatically for us

