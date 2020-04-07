rsync -a -L -v -e ssh  awsmono:/etc/letsencrypt/live/monorift.com /Users/Bobby/Development/monorift/private/certs  --rsync-path="sudo /usr/bin/rsync"
rsync -a -L -v -e ssh  awsmono:/etc/letsencrypt/live/turn.monorift.com /Users/Bobby/Development/monorift/private/certs  --rsync-path="sudo /usr/bin/rsync"
rsync -a -L -v -e ssh  awsmono:/etc/letsencrypt/live/stun.monorift.com /Users/Bobby/Development/monorift/private/certs  --rsync-path="sudo /usr/bin/rsync"
rsync -a -L -v -e ssh  awsmono:/etc/letsencrypt/live/robertmozeika.com /Users/Bobby/Development/monorift/private/certs  --rsync-path="sudo /usr/bin/rsync"
