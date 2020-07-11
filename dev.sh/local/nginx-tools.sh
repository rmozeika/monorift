#/bin/bash

brew tap denji/nginx
brew install nginx-full --with-stream --with-stream-ssl --with-stream-ssl-preread --with-stream-geoip --with-stream-realip  --with-secure-link
# DEPRECATED :(
# brew tap homebrew/nginx
# brew tap homebrew/nginx
# brew options nginx-full
# brew info nginx-full
# brew install nginx-full --with-rtmp-module --with-debug