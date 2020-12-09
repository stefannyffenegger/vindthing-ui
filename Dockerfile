FROM node:15.3.0-alpine3.12

# create destination directory
RUN mkdir -p /usr/src/vindthing
WORKDIR /usr/src/vindthing

# update and install dependency
RUN apk update && apk upgrade

# copy the app, note .dockerignore
COPY . /usr/src/vindthing/
RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

# expose 6000 on container
EXPOSE 6000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=6000

# Traefik Deployment
LABEL "traefik.enable"="true"
LABEL "traefik.http.routers.whoami.rule"="Host(`vindthing.scientists.ch`)"
LABEL "traefik.http.routers.whoami.entrypoints"="websecure"
LABEL "traefik.http.routers.whoami.tls.certresolver"="myresolver"

# start the app
CMD [ "npm", "start" ]