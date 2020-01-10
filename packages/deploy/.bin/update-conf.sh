#/bin/bash
rsync -v -e ssh  ./local.conf ec2-user@aws:/home/ec2-user/monorift/packages/deploy/local.conf
