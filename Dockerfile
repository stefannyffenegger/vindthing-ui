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

# expose 9900 on container
EXPOSE 9900

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=9900

# env
ARG BASE_URL_API
ENV BASE_URL_API ${BASE_URL_API}

# Traefik Deployment
LABEL "traefik.enable"="true"
LABEL "traefik.http.routers.vindthing-ui.rule"="Host(`vindthing.scientists.ch`)"
LABEL "traefik.http.routers.vindthing-ui.entrypoints"="websecure"
LABEL "traefik.http.routers.vindthing-ui.tls.certresolver"="myresolver"

# start the app
CMD [ "npm", "start" ]