rsync -v -e ssh  ./nginx/ec2.conf awsmono:/etc/nginx/nginx.conf --rsync-path="sudo /usr/bin/rsync"
