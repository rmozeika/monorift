FROM nginx
COPY ./packages/devops/nginx/remote.conf /etc/nginx/nginx.conf
COPY ./packages/devops/nginx/logs /home/logs
COPY ./private/fullchain.pem /private/fullchain.pem
COPY ./private/privatekey.pem /private/privatekey.pem
# VOLUME /usr/share/nginx/html
#VOLUME /etc/nginx