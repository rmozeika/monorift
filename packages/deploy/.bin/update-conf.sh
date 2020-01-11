#/bin/bash
rsync -v -e ssh  ./local.conf awsmono:/home/monorift/monorift/packages/deploy/local.conf
