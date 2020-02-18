rsync -a -L -v -e ssh  awsmono:/etc/letsencrypt/live/monorift.com /Users/Bobby/Development/monorift/private/certs  --rsync-path="sudo /usr/bin/rsync"
