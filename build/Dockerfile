FROM nginx:latest

COPY *.html /usr/share/nginx/
COPY *.js /usr/share/nginx/
COPY *.css /usr/share/nginx/

COPY build/nginx.conf /etc/nginx/

EXPOSE 8000
