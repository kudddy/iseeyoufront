# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
RUN apk add python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev rust cargo
RUN pip3 install pip --upgrade
RUN pip install certbot-nginx
RUN mkdir /etc/letsencrypt

COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx_https.conf /etc/nginx/conf.d/default.conf

COPY letsencrypt /etc/letsencrypt
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

